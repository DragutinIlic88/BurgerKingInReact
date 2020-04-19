import React, { Component } from "react";

import Modal from "../../components/UI/Modal/Modal";
import Aux from "../Auxuliary/Auxiliary";

//function based component which has as paramters component which we want to wrap , and axios object which is used for server communication.
//Component returns class based component which is wrapped component with added error handling functionality.
const withErrorHandler = (WrappedComponent, axios) => {
  return class extends Component {
    state = {
      error: null,
    };

    //creational lifecycle method which can be used for communication with server
    componentDidMount() {
      //interceptors property is used for global configuration of request and response
      axios.interceptors.request.use((req) => {
        this.setState({ error: null });
        //must return value or it will block further progress
        return req;
      });
      axios.interceptors.response.use(
        //must return value or will block further progress
        (res) => res,
        (error) => {
          this.setState({ error: error });
        }
      );
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
