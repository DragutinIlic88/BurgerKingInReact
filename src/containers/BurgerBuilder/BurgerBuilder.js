import React, { Component } from "react";

import Aux from "../../hoc/Auxuliary/Auxiliary";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import axios from "../../axios-orders";

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7,
};

class BurgerBuilder extends Component {
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
    ingredients: null,
    totalPrice: 4,
    purchasable: false,
    purchasing: false,
    loading: false,
    error: false,
  };

  componentDidMount() {
    axios
      .get("https://react-my-burger-7cb97.firebaseio.com/ingredients.json")
      .then((response) => {
        this.setState({ ingredients: response.data });
      })
      .catch((error) => {
        this.setState({ error: true });
      });
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
    this.setState({ purchasable: sum > 0 });
  }

  //this method is passed to BuildControls component ant it is called when some ingridinet is added
  addIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    const updatedCount = oldCount + 1;
    const updatedIngredients = {
      ...this.state.ingredients,
    };
    updatedIngredients[type] = updatedCount;
    const priceAddition = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;
    //never change existing state of application , always set new state with setState method
    this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });
    this.updatePurchaseState(updatedIngredients);
  };

  //this method is passed to BuildControls component ant it is called when some ingridinet is removed
  removeIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    if (oldCount <= 0) {
      return;
    }
    const updatedCount = oldCount - 1;
    const updatedIngredients = {
      ...this.state.ingredients,
    };
    updatedIngredients[type] = updatedCount;
    const priceDeduction = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice - priceDeduction;
    //never change existing state of application , always set new state with setState method
    this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });
    this.updatePurchaseState(updatedIngredients);
  };

  purchaseHandler = () => {
    this.setState({ purchasing: true });
  };

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false });
  };

  purchaseContinueHandler = () => {
    this.setState({ loading: true });
    const order = {
      ingredients: this.state.ingredients,
      price: this.state.totalPrice,
      customer: {
        name: "Dragutin Ilic",
        address: {
          street: "Teststreet 1",
          zipCode: "11080",
          country: "Serbia",
        },
        email: "test@test.com",
      },
      deliveryMethod: "fastest",
    };
    axios
      .post("/orders.json", order)
      .then((response) => {
        this.setState({ loading: false, purchasing: false });
      })
      .catch((error) => {
        this.setState({ loading: false, purchasing: false });
      });
  };

  render() {
    //copy of ingredients object
    const disabledInfo = {
      ...this.state.ingredients,
    };
    //disabledInfo is filled with boolean value if ingredient number is 0
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }
    let orderSummary = null;

    if (this.state.loading) {
      orderSummary = <Spinner />;
    }
    //in case react can't get burger from server , it will return some error status which is catch with axios object;
    //state is set to true in that case and message is displayed to the user.
    //if error is false that means that response still didn't arrived from server so spinner component is placed.
    let burger = this.state.error ? (
      <p>Ingredients can't be loaded!</p>
    ) : (
      <Spinner />
    );

    //ingredients will be set to state dinamicaly from server in componentDidMount lifecycle method
    if (this.state.ingredients) {
      burger = (
        <Aux>
          <Burger ingredients={this.state.ingredients} />
          <BuildControls
            ingredientAdded={this.addIngredientHandler}
            ingredientRemoved={this.removeIngredientHandler}
            disabled={disabledInfo}
            purchasable={this.state.purchasable}
            ordered={this.purchaseHandler}
            price={this.state.totalPrice}
          />
        </Aux>
      );

      orderSummary = (
        <OrderSummary
          price={this.state.totalPrice}
          ingredients={this.state.ingredients}
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

//here is used another high order component, which is the wrapper for BurgerBuilder component
// and it is used for handling of errors for ajax calls.
export default withErrorHandler(BurgerBuilder, axios);
