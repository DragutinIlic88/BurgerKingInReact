import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
//applyMiddleware is a function which receives as argument(s) middleware(s) which is (are) used inside application
//compose function is used for redax dev tools as default option
//combineReducer function receives as parametar object which each key value pair is reducer used inside application
import { createStore, applyMiddleware, compose, combineReducers } from "redux";
//thunk middeware is used for fetching data from firebase dataabase with help of axios
import thunk from "redux-thunk";

import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import burgerBuilderReducer from "./store/reducers/burgerBuilder";
import orderReducer from "./store/reducers/order";
import authReducer from "./store/reducers/auth";

//for enabling redux tools on browser with burger app
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

//it is good practice to seperate reducer into multiple reducers based on application and then combine thouse reducer into one
//using combineReducers function
const rootReducer = combineReducers({
  burgerBuilder: burgerBuilderReducer,
  order: orderReducer,
  auth: authReducer,
});

//creation of redux store which is responsible for manageing app state
//store will use rootReducer combine reducer and thunk middleware will intercept certain actions
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

//App component is wrapped with BrowserRouter component , thus enabled routing.
// If we need to use redux in combination with routing it is recommended that Provider component be root component
// So inside provider component we place BrowserRouter component and in it our App component
const app = (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(app, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
