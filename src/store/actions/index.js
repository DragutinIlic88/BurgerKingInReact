//THIS IS GOOD PRACTICE , HAVING ONE FILE FROM WHICH IS EXPORTED ALL THAT IS NECCESSARY
export {
  addIngredient,
  removeIngredient,
  initIngredients,
} from "./burgerBuilder";
export { purchaseBurger, purchaseInit, fetchOrders } from "./order";
export { auth, logout } from "./auth";
