import React from "react";
import { Route, Switch } from "react-router-dom";
import Layout from "./hoc/Layout/Layout";
import BurgerBuilder from "./containers/BurgerBuilder/BurgerBuilder";
import Checkout from "./containers/Checkout/Checkout";

function App() {
  return (
    <div>
      <Layout>
        {/* With Switch component only first Route with  path which is matched will be  displayed. Need to be careful about the order of Route component */}
        <Switch>
          <Route path="/checkout" component={Checkout} />
          {/*exact property tells that path must be the same (not prefix) */}
          <Route path="/" exact component={BurgerBuilder} />
        </Switch>
      </Layout>
    </div>
  );
}

export default App;
