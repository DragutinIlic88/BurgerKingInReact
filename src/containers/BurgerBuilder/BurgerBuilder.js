import React, { Component } from "react";
import { connect } from "react-redux";

import Aux from "../../hoc/Auxuliary/Auxiliary";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import axios from "../../axios-orders";
import * as actions from "../../store/actions/index";

//adding export in front of container is for testing purpose
export class BurgerBuilder extends Component {
  // This is conventional way to initialize state in class based component
  // if we use contructor function which is one of creational lifecycle methods
  // we need to also call super method (which is constructor of Component class)
  // and pass it props argument.
  // constructor(props){
  //   super(props);
  //   this.state = {...}
  // }
  //syntatic sugar of above is
  state = {
    purchasing: false,
  };

  componentDidMount() {
    this.props.onInitIngredients();
  }

  //this method is called for checking if
  //burger can be purchased after some action
  updatePurchaseState(ingredients) {
    const sum = Object.keys(ingredients)
      //getting array of numbers , where every number represents how many of specific ingredient
      //is added to the burger
      .map((igKey) => {
        return ingredients[igKey];
      })
      //getting overall number of all ingredients in burger
      .reduce((sum, el) => {
        return sum + el;
      }, 0);

    //if number is larger then 0 burger is purchaseble
    return sum > 0;
  }

  //this method is passed to BuildControls component ant it is called when some ingridinet is added
  //NOTE: WE realocated logic of this method in reducer because we are now handling our state from redux
  // addIngredientHandler = (type) => {
  //   const oldCount = this.state.ingredients[type];
  //   const updatedCount = oldCount + 1;
  //   const updatedIngredients = {
  //     ...this.state.ingredients,
  //   };
  //   updatedIngredients[type] = updatedCount;
  //   const priceAddition = INGREDIENT_PRICES[type];
  //   const oldPrice = this.state.totalPrice;
  //   const newPrice = oldPrice + priceAddition;
  //   //never change existing state of application , always set new state with setState method
  //   this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });
  //   this.updatePurchaseState(updatedIngredients);
  // };

  //this method is passed to BuildControls component ant it is called when some ingridinet is removed
  //NOTE: WE realocated logic of this method in reducer because we are now handling our state from redux
  // removeIngredientHandler = (type) => {
  //   const oldCount = this.state.ingredients[type];
  //   if (oldCount <= 0) {
  //     return;
  //   }
  //   const updatedCount = oldCount - 1;
  //   const updatedIngredients = {
  //     ...this.state.ingredients,
  //   };
  //   updatedIngredients[type] = updatedCount;
  //   const priceDeduction = INGREDIENT_PRICES[type];
  //   const oldPrice = this.state.totalPrice;
  //   const newPrice = oldPrice - priceDeduction;
  //   //never change existing state of application , always set new state with setState method
  //   this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });
  //   this.updatePurchaseState(updatedIngredients);
  // };

  purchaseHandler = () => {
    if (this.props.isAuthenticated) {
      this.setState({ purchasing: true });
    } else {
      this.props.onSetAuthRedirectPath("/checkout");
      this.props.history.push("/auth");
    }
  };

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false });
  };

  purchaseContinueHandler = () => {
    //ingredients will be passed with routing mechanisam to the checkout page
    //in this example histroy.push method with config object is used to set
    // search property to proper query string
    //NOTE: This is bad practice for passing peice of state, it will be done with redux
    // const queryParams = [];
    // for (let i in this.state.ingredients) {
    //   queryParams.push(
    //     encodeURIComponent(i) +
    //       "=" +
    //       encodeURIComponent(this.state.ingredients[i])
    //   );
    // }
    // queryParams.push("price=" + this.state.totalPrice);
    // const queryString = queryParams.join("&");
    // this.props.history.push({
    //   pathname: "/checkout",
    //   search: "?" + queryString,
    // });

    this.props.onInitPurchase();
    this.props.history.push("/checkout");
  };

  render() {
    //copy of ingredients object
    const disabledInfo = {
      ...this.props.ings,
    };
    //disabledInfo is filled with boolean value if ingredient number is 0
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }
    let orderSummary = null;

    //in case react can't get burger from server , it will return some error status which is catch with axios object;
    //state is set to true in that case and message is displayed to the user.
    //if error is false that means that response still didn't arrived from server so spinner component is placed.
    let burger = this.props.error ? (
      <p>Ingredients can't be loaded!</p>
    ) : (
      <Spinner />
    );

    //ingredients will be set to state dinamicaly from server in componentDidMount lifecycle method
    if (this.props.ings) {
      burger = (
        <Aux>
          <Burger ingredients={this.props.ings} />
          <BuildControls
            ingredientAdded={this.props.onIngredientAdded}
            ingredientRemoved={this.props.onIngredientRemoved}
            disabled={disabledInfo}
            purchasable={this.updatePurchaseState(this.props.ings)}
            ordered={this.purchaseHandler}
            price={this.props.price}
            isAuth={this.props.isAuthenticated}
          />
        </Aux>
      );

      orderSummary = (
        <OrderSummary
          price={this.props.price}
          ingredients={this.props.ings}
          purchaseCanceled={this.purchaseCancelHandler}
          purchaseContinued={this.purchaseContinueHandler}
        />
      );
    }

    return (
      <Aux>
        <Modal
          show={this.state.purchasing}
          modalClosed={this.purchaseCancelHandler}
        >
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
}

//BurgerBuildr container will need some data from state,
//that data is available with help of this function in props of container
const mapStateToProps = (state) => {
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error,
    isAuthenticated: state.auth.token != null,
  };
};

//BurgerBuilder container will need to dispatch some information to the redux reducers
//This is done with mapDispatchToProps function which returns object where each property
// is function which can be called from props and passed to it some information
const mapDispatchToProps = (dispatch) => {
  return {
    onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
    onIngredientRemoved: (ingName) =>
      dispatch(actions.removeIngredient(ingName)),
    onInitIngredients: () => dispatch(actions.initIngredients()),
    onInitPurchase: () => dispatch(actions.purchaseInit()),
    onSetAuthRedirectPath: (path) =>
      dispatch(actions.setAuthRedirectPath(path)),
  };
};

//here is used another high order component, which is the wrapper for BurgerBuilder component
// and it is used for handling of errors for ajax calls.
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(BurgerBuilder, axios));
