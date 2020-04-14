import React from "react";
import classes from "./Button.module.css";

const button = (props) => (
  <button
    //here we are using syntax for assigning button more than one class, where second class depends on condition props.btnType
    // that way button can be generic and refer to cancel and also to continue
    className={[classes.Button, classes[props.btnType]].join(" ")}
    onClick={props.clicked}
  >
    {props.children}
  </button>
);

export default button;
