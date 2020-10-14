import React from 'react';
import Alert from 'react-bootstrap/Alert';
import { CartCss } from '../utils';

class Messages extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleClose = this.handleClose.bind(this);
      this.state = {
        show: false,
        variantClass:"",
        alertMessage:"",
      };
    }

  handleClose() {
    this.setState({
      show: false,
      variantClass:"",
      alertMessage:"",
    });
  }
  componentDidMount() {
    this.componentDidUpdate({ variantClass: "", alertMessage: "" });
  }

  componentDidUpdate(prevProps) {
    if(prevProps.alertMessage!==this.props.alertMessage){
      this.setState({
        alertMessage: this.props.alertMessage,
        variantClass: this.props.variantClass,
        show: true,
      });
    }
  }
  render() {
    return (
      <>
      <CartCss />
      {this.state.show ? (
      <Alert variant={this.state.variantClass} onClose={() => this.handleClose()} dismissible>
        {this.state.alertMessage}
      </Alert>):(<></>)
      }
      </>
    );
  }
}

export default Messages;
