import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import PropTypes from 'prop-types';
import * as utils from './Common/utils';
import { CartCss } from './Common/utils';
import { connect } from 'react-redux';
import Messages from './Messages';
import Spinner from 'react-bootstrap/Spinner';
import PaymentInfo from './Checkout/PaymentInfo';
import AddressManager from './Checkout/AddressManager';

class Payment extends React.Component {
  constructor(props) {
    super(props);
    const Config = require('../config.json');
    this.setCard = this.setCard.bind(this);
    this.setAddress = this.setAddress.bind(this);
    this.processSale = this.processSale.bind(this);
    this.luhn_checksum = this.luhn_checksum.bind(this);
    this.luhn_validate = this.luhn_validate.bind(this);
    this.addAddress = this.addAddress.bind(this);

    this.state = {
      Config,
      API: Config.apiAddress,
      show: false,
      error: '',
      order: {},
      variantClass: '',
      formSubmitted: '',
      card: {
        isValid: false,
        type: '',
        cvc: '',
        cardNumber: '',
        expiryDate: ''
      },
      address: {
        type: 'billing',
        street: '',
        city: '',
        state: 'Illinois',
        zip: ''
      }
    };
  }

  componentDidMount() {
    let confirm = {};

    if (this.props.match && this.props.match.params.guid) {
      confirm = {
        f: 'fixpay',
        linkHEX: this.props.match.params.guid
      };
    }

    if (confirm.f) {
      utils.ApiPostRequest(this.state.API + 'checkout', confirm).then((data) => {
        if (data && data.status === 200) {
          this.setState({
            order: data.result
          });
        } else {
          this.setState({
            error: 'You have clicked an invalid link',
            variantClass: 'danger'
          });
        }
      });
    }
  }

  addAddress() {
    const error = this.state.error;

    const confirm = {
      f: 'addAddress',
      user: this.props.loggedIn.email,
      session: this.props.loggedIn.sessionID,
      address: this.state.address
    };

    utils.ApiPostRequest(this.state.API + 'auth', confirm).then((data) => {
      if (data) {
        if (data.Variant && data.Variant === 'success') {
          const addresses = [...this.props.loggedIn.addresses];

          const address = { ...data.address };

          address.addressId = data.address;

          this.setState({
            addressId: data.addressID,
            address
          }, () => {
            addresses.push(this.state.address);
            this.props.setLoginObject({
              ...this.props.loggedIn,
              addresses
            });
          });

          this.handleClose();
        } else {
          error.push({ msg: data.message, variant: 'danger' });
        }
      } else {
        error.push({ msg: 'An unexpected error occurred.', variant: 'danger' });
      }

      this.setState({
        error
      });
    });
  }

  setCard(card) {
    let isValid;

    let cvc = this.state.card.cvc;

    let cardNumber = this.state.card.cardNumber;

    let expiryDate = this.state.card.expiryDate;

    switch (card.target.name) {
      case 'expiryDate':
        expiryDate = card.target.value;
        break;
      case 'cardNumber':
        cardNumber = card.target.value.replaceAll(' ', '');
        break;
      case 'cvc':
        cvc = card.target.value;
        break;
      default:
    }

    if (card.target.name === 'cardNumber' && this.luhn_validate(cardNumber)) {
      isValid = true;
    } else {
      isValid = false;
    }
    this.setState({
      card: {
        isValid,
        cvc,
        cardNumber,
        expiryDate
      }
    });
  }

  luhn_checksum(code) {
    const len = code.length;

    const parity = len % 2;

    let sum = 0;

    for (let i = len - 1; i >= 0; i--) {
      let d = parseInt(code.charAt(i));

      if (isNaN(d)) {
        continue;
      }

      if (i % 2 === parity) {
        d = d * 2;
      }

      if (d > 9) {
        d = d - 9;
      }

      sum = sum + d;
    }
    return sum % 10;
  }

  luhn_validate(fullcode) {
    return this.luhn_checksum(fullcode) === 0;
  }

  setAddress(address) {
    const type = 'billing';

    let street = this.state.address.street;

    let city = this.state.address.city;

    let state = this.state.address.state;

    let zip = this.state.address.zip;

    if (typeof (address) === 'string') {
      state = address;
    } else {
      switch (address.target.name) {
        case 'street':
          street = address.target.value;
          break;
        case 'city':
          city = address.target.value;
          break;
        case 'state':
          state = address.target.value;
          break;
        case 'zip':
          zip = address.target.value;
          break;
        default:
      }
    }
    this.setState({
      address: {
        type,
        street,
        city,
        state,
        zip
      }
    });
  }

  processSale() {

  }

  render() {

    return (
      <Container style={{padding: "1em"}}>
        <h2>Payment</h2>
        {this.state.formSubmitted ? (
          <>
            <div style={{ textAlign: 'center' }}>
              <div>Processing...</div>
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            </div>
          </>
        ) : (
          <>
            {this.state.error ? (<Messages variantClass={this.state.variantClass} alertMessage={this.state.error}/>) : (<></>)}
            <Row style={{paddingTop: "1em"}}>
              <Col><strong>Expected Delivery:</strong></Col><Col>{this.state.order.dateDue}</Col>
            </Row>
            <Row style={{paddingTop: "1em"}}>
              <Col><strong>Amount Due:</strong></Col><Col>${this.state.order.mbService}</Col>
            </Row>
            <Row>
              <Col><hr/></Col>
            </Row>
            <Row style={{paddingTop: "1em"}}>
              <Col>
            <AddressManager
              handleBilling={this.handleBilling}
              setAddress={this.setAddress}
              billingName={this.state.billingName}
              address={this.state.address} addAddress={this.addAddress}/>
                </Col><Col>
            <PaymentInfo setCard={this.setCard} amount={this.state.order.mbService}/>
            </Col>
            </Row>
          </>
        )}

      </Container>
    );
  }

}

export default Payment;