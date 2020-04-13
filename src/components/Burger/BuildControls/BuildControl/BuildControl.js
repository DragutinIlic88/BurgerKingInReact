import React from "react";
import classes from "./BuildControl.module.css";
/**
 * BuildControl is stateless (funcional) component which has two buttons.
 * Buttons can be disabled and that condition is passed via props argument from paranet component.
 * First button when click on it calles removed propertie from props object, while second calls
 * added propertie of props object.
 */
const buildControl = (props) => (
  <div className={classes.BuildControl}>
    <div className={classes.Label}>{props.label}</div>
    <button
      className={classes.Less}
      onClick={props.removed}
      disabled={props.disabled}
    >
      Less
    </button>
    <button className={classes.More} onClick={props.added}>
      More
    </button>
  </div>
);

export default buildControl;
