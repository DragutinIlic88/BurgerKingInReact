import React from "react";

//shallow function is used for rendering components
//shallow render content of component, but it is not deeply rendered
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import NavigationItems from "./NavigationItems";
import NavigationItem from "./NavigationItem/NavigationItem";

//connecting the enzyme with help of Adapter
configure({ adapter: new Adapter() });

describe("<NavigationItems />", () => {
  let wrapper;

  //this function performs some initial setup before every it function is executed
  beforeEach(() => {
    //shallow method receive as argument JSX
    wrapper = shallow(<NavigationItems />);
  });

  it("should render two <NavigationItem /> elements if not authenticated", () => {
    //inside this method code for checking certain assertion is placed
    //inside wrapper find method is not JSX; it is exported function
    expect(wrapper.find(NavigationItem)).toHaveLength(2);
  });

  it("should render three <NavigationItem /> elements if authenticated", () => {
    wrapper.setProps({ isAuthenticated: true });
    expect(wrapper.find(NavigationItem)).toHaveLength(3);
  });

  it("should an exact logout button", () => {
    wrapper.setProps({ isAuthenticated: true });
    expect(
      //conations is enzyme method helper which receives as argument node
      wrapper.contains(<NavigationItem link="/logout">Logout</NavigationItem>)
    ).toEqual(true);
  });
});
