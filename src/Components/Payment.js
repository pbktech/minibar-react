import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import PropTypes from 'prop-types';
import * as utils from './Common/utils';
import { CartCss } from './Common/utils';
import { connect } from 'react-redux';

class Payment extends React.Component {
  constructor(props) {
    super(props);
    const Config = require('../config.json');

    this.state = {
      Config,
      API: Config.apiAddress,
      show: false,
    };
  }
  componentDidMount() {
    let confirm = {};

    if (this.props.match && this.props.match.params.guid) {
      confirm = {
        f: 'fixpay',
        guid: this.props.match.params.guid,
      };
    }

    if (confirm.f) {
      utils.ApiPostRequest(this.state.API + 'checkout', confirm).then((data) => {
        if (data) {
          this.setState({
            order: data,
          });
        } else {
          this.setState({
            error: 'Sorry, an unexpected error occurred',
            variantClass: 'danger',
          });
        }
      });
    }
  }

  render(){
    return (<>{this.props.match.params.guid}</>);

    return (
      <Container>

      </Container>
    );
  }

}

export default Payment;