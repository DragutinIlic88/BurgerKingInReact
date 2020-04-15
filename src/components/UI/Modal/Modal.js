import React, { Component } from "react";
import classes from "./Modal.module.css";
import Aux from "../../../hoc/Auxuliary/Auxiliary";
import Backdrop from "../Backdrop/Backdrop";

class Modal extends Component {
  //we are using shouldComponentUpdate lifecycle method so that OrderSummary component dosn't need to rerender
  //every time when some button for ingredient is pressed. OrderSummary should be updated only when modal is shown.
  //That is why we have following condition
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.show !== this.props.show;
  }

  componentWillUpdate() {
    console.log("[Modal] Will Update");
  }

  render() {
    return (
      <Aux>
        <Backdrop show={this.props.show} clicked={this.props.modalClosed} />
        <div
          className={classes.Modal}
          style={{
            transform: this.props.show ? "translateY(0)" : "translateY(-100vh)",
            opacity: this.props.show ? "1" : "0",
          }}
        >
          {this.props.children}
        </div>
      </Aux>
    );
  }
}

export default Modal;
