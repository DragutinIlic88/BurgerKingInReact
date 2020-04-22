import React, { Component } from "react";

import Modal from "../../components/UI/Modal/Modal";
import Aux from "../Auxuliary/Auxiliary";

//function based component which has as paramters component which we want to wrap , and axios object which is used for server communication.
//Component returns class based component which is wrapped component with added error handling functionality.
const withErrorHandler = (WrappedComponent, axios) => {
  return class extends Component {
    constructor(props) {
      super(props);
      this.state = { error: null };
      //interceptors property is used for global configuration of request and response
      this.reqInterceptor = axios.interceptors.request.use((req) => {
        this.setState({ error: null });
        //must return value or it will block further progress
        return req;
      });
      this.resInterceptor = axios.interceptors.response.use(
        //must return value or will block further progress
        (res) => res,
        (error) => {
          this.setState({ error: error });
        }
      );
    }
    // state = {
    //   error: null,
    // };

    //creational lifecycle method which can be used for communication with server
    //NOTE: we moved axios logic to constructor because there was an error inside child component
    //child component with it lifecycle methods is triggered before componentDidMount
    // so intercepters will not be set if we put it inside componentDidMount method
    //componentDidMount() {}

    //if we don't want memory leaks we need to remove interceptors
    componentWillUnmount() {
      axios.interceptors.request.eject(this.reqInterceptor);
      axios.interceptors.response.eject(this.resInterceptor);
    }

    errorConfirmedHandler = () => {
      this.setState({ error: null });
    };

    render() {
      return (
        <Aux>
          <Modal
            show={this.state.error}
            modalClosed={this.errorConfirmedHandler}
          >
            {this.state.error ? this.state.error.message : null}
          </Modal>
          <WrappedComponent {...this.props} />
        </Aux>
      );
    }
  };
};

export default withErrorHandler;
