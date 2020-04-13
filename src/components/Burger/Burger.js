import React from "react";

import classes from "./Burger.module.css";
import BurgerIngredient from "./BurgerIngredient/BurgerIngredient";

const burger = (props) => {
  //Object keys takes ingredinets object as argument and returns array of all properties and methods inside that object
  //map function is performed for every ingredient inside that array
  let transformedIngedients = Object.keys(props.ingredients)
    .map((igKey) => {
      //For every ingredient new array is returned which has same number of elements as number of that particular ingredients
      //and every element is BurgerIngredient component with passed ingredient as type
      return [...Array(props.ingredients[igKey])].map((_, i) => (
        <BurgerIngredient key={igKey + i} type={igKey} />
      ));
    })
    //this function is used for flattening the array of arrays into one array
    .reduce((arr, el) => {
      return [...arr, ...el];
    }, []);

  if (transformedIngedients.length === 0) {
    transformedIngedients = <p>Please start adding ingredients!</p>;
  }
  return (
    <div className={classes.Burger}>
      <BurgerIngredient type="bread-top" />
      {transformedIngedients}
      <BurgerIngredient type="bread-bottom" />
    </div>
  );
};

export default burger;
