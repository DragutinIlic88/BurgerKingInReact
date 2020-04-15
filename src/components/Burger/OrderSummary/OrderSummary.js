import React, { Component } from "react";
import Aux from "../../../hoc/Auxuliary/Auxiliary";
import Button from "../../UI/Button/Button";

class OrderSummary extends Component {
  //this could be the functional component, not a class
  //we convert it to the class because we wanted to use componentWillUpdate for debugging purpose
  //When want to debug uncomment following lines
  // componentWillUpdate() {
  //   console.log("[OrderSummary] WillUpdate");
  // }

  render() {
    const ingredientSummary = Object.keys(this.props.ingredients).map(
      (igKey) => {
        return (
          <li key={igKey}>
            <span style={{ textTransform: "capitalize" }}>{igKey}</span>:{" "}
            {this.props.ingredients[igKey]}
          </li>
        );
      }
    );

    return (
      <Aux>
        <h3>Your Order</h3>
        <p>A delicious burger with the following ingredients:</p>
        <ul>{ingredientSummary}</ul>
        <p>
          <strong>Total Price: {this.props.price.toFixed(2)}</strong>
        </p>
        <p>Continue to Checkout?</p>
        <Button btnType="Danger" clicked={this.props.purchaseCanceled}>
          CANCEL
        </Button>
        <Button btnType="Success" clicked={this.props.purchaseContinued}>
          CONTINUE
        </Button>
      </Aux>
    );
  }
}

export default OrderSummary;
