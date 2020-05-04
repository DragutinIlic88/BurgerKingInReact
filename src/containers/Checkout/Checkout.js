import React, { Component } from "react";
import { Route } from "react-router-dom";
import { connect } from "react-redux";
import CheckoutSummary from "../../components/Order/CheckoutSummary/CheckoutSummary";
import ContactData from "./ContactData/ContactData";

//class based container used for managing state of checkout page
class Checkout extends Component {
  //when component is mounted query is extracted and is wrapped in URLSearchParams object
  //in that query information about ingredients is located and state of Checkout component
  // is set to that ingredients which is passed from BurgerBuilder component
  // NOTE: With intorduction of redux this logic is not neccssary
  // componentWillMount() {
  //   const query = new URLSearchParams(this.props.location.search);
  //   const ingredients = {};
  //   let price = 0;
  //   for (let param of query.entries()) {
  //     if (param[0] === "price") {
  //       price = param[1];
  //     } else {
  //       ingredients[param[0]] = +param[1];
  //     }
  //   }
  //   this.setState({ ingredients: ingredients, totalPrice: price });
  // }

  checkoutCancelledHandler = () => {
    //function for navigation to the previous page (collected from stack)
    this.props.history.goBack();
  };

  checkoutContinuedHandler = () => {
    //realocation to the new page
    this.props.history.replace("/checkout/contact-data");
  };

  render() {
    return (
      <div>
        <CheckoutSummary
          ingredients={this.props.ings}
          checkoutCancelled={this.checkoutCancelledHandler}
          checkoutContinued={this.checkoutContinuedHandler}
        />
        <Route
          path={`${this.props.match.path}/contact-data`}
          component={ContactData}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ings: state.ingredients,
  };
};

export default connect(mapStateToProps)(Checkout);
