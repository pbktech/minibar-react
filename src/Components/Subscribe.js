import React from 'react';
import BeatLoader from 'react-spinners/ClipLoader';
import Messages from './Messages';
import PaymentInputs from './Common/PaymentInputs';
import Form from 'react-bootstrap/Form';
import * as utils from './Common/utils';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import { formatPhoneNumber } from 'react-phone-number-input';
import Input from 'react-phone-number-input/input';
import Button from 'react-bootstrap/Button';

class Subscribe extends React.Component {
  constructor(props) {
    super(props);
    const Config = require('../config.json');

    this.setCard = this.setCard.bind(this);
    this.showForm = this.showForm.bind(this);
    this.processForm = this.processForm.bind(this);
    this.handlePhone = this.handlePhone.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.luhnChecksum = this.luhnChecksum.bind(this);
    this.luhnValidate = this.luhnValidate.bind(this);

    this.state = {
      Config,
      API: Config.apiAddress,
      error: [],
      processing: false,
      phoneNumber: '',
      emailAddress: '',
      card: {
        isValid: false,
        billingName: '',
        type: '',
        cvc: '',
        cardNumber: '',
        expiryDate: '',
      },
    };
  }

  setCard(card) {
    let isValid = this.state.card.isValid;

    let cvc = this.state.card.cvc;

    let cardNumber = this.state.card.cardNumber;

    let expiryDate = this.state.card.expiryDate;

    let billingName = this.state.card.billingName;

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
      case 'billingName':
        billingName = card.target.value;
        break;
      default:
    }

    if (card.target.name === 'cardNumber' && this.luhnValidate(cardNumber)) {
      isValid = true;
    } else {
      isValid = false;
    }
    this.setState({
      card: {
        isValid,
        billingName,
        cvc,
        cardNumber,
        expiryDate,
      },
    });
  }
  handleChange(e) {
    const name = e.target.name;
    const value = (e.target.type === 'checkbox') ? e.target.checked : e.target.value;

    const newState = {};

    newState[name] = value;
    this.setState(newState);
  }
  handlePhone(newValue) {
    this.setState({
      phoneNumber: newValue,
    });
  }
  luhnChecksum(code) {
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

  luhnValidate(fullcode) {
    return this.luhnChecksum(fullcode) === 0;
  }

  processForm() {
    const error = [];

    if (!this.state.card.billingName) {
      error.push({ msg: 'Please enter your name', variant: 'danger' });
    }
    if (!this.state.emailAddress) {
      error.push({ msg: 'Please enter your e-mail address', variant: 'danger' });
    }
    if (!this.state.phoneNumber) {
      error.push({ msg: 'Please enter your phone number', variant: 'danger' });
    }

    if (!this.state.card.cardNumber) {
      error.push({ msg: 'Please enter a card number', variant: 'danger' });
    }
    if (!this.state.card.cvc) {
      error.push({ msg: 'Please enter a cvv', variant: 'danger' });
    }
    if (!this.state.card.expiryDate) {
      error.push({ msg: 'Please enter an expiration date', variant: 'danger' });
    }
    if (!this.luhnValidate(this.state.card.cardNumber)) {
      error.push({ msg: 'Invalid card number', variant: 'danger' });
    }

    if (!error.length) {
      this.setState({
        processing: true,
      });

      const confirm = {
        f: 'subscribe',
        emailAddress: this.state.emailAddress,
        phoneNumber: this.state.phoneNumber,
        card: this.state.card,
      };

      utils.ApiPostRequest(this.state.API + 'checkout', confirm).then((data) => {
        if (data) {
          if (data.status && data.status === 200) {
            error.push({ msg: 'Payment Applied', variant: 'success' });
          } else {
            error.push({ msg: 'Payment Failure.', variant: 'danger' });
          }
        } else {
          error.push({ msg: 'An unexpected error occurred.', variant: 'danger' });
        }
        this.setState({
          processing: false,
          error,
        });
      });
    } else {
      this.setState({
        error,
      });
    }
  }

  showForm() {
    return (
      <Form>
        <Form.Row style={{ width: '100%' }}>
          <Form.Group as={Col}>
            <Form.Label style={{ fontWeight: 'bold' }}>Your Name</Form.Label>
            <Form.Control name={'billingName'} onChange={this.setCard} value={this.state.card.billingName} />
          </Form.Group>
        </Form.Row>
        <Form.Row style={{ width: '100%' }}>
          <Form.Group as={Col}>
            <Form.Label style={{ fontWeight: 'bold' }}>Phone Number</Form.Label>
            <Input
              className="form-control"
              country="US"
              value={this.state.phoneNumber}
              onChange={this.handlePhone} />
          </Form.Group>
        </Form.Row>
        <Form.Row style={{ width: '100%' }}>
          <Form.Group as={Col}>
            <Form.Label style={{ fontWeight: 'bold' }}>Your Email</Form.Label>
            <Form.Control name={'emailAddress'} onChange={this.handleChange} value={this.state.emailAddress} />
          </Form.Group>
        </Form.Row>
        <Form.Row style={{ width: '100%' }}>
          <Form.Group as={Col} controlId="creditCard" style={{ paddingTop: '1em', width: '100%' }}>
            <PaymentInputs setCard={this.setCard} />
          </Form.Group>
        </Form.Row>
        <Form.Row style={{ width: '100%' }}>
          <Form.Group as={Col} controlId="creditCard" style={{ paddingTop: '1em', width: '100%' }}>
            <Button variant={'brand'} onClick={this.processForm}>Subscribe</Button>
          </Form.Group>
        </Form.Row>
      </Form>
    );
  }

  render() {
    if (this.state.processing) {
      return (
        <div className="sweet-loading" style={{ textAlign: 'center' }}>
          <BeatLoader sizeUnit={'px'} size={150} color={utils.pbkStyle.orange} />
        </div>
      );
    }
    return (
      <Container fluid style={{ padding: '1em' }}>
        {this.state.error.length > 0 && this.state.error.map((entry, i) => {
          return (<Messages key={'message_' + i} variantClass={entry.variant} alertMessage={entry.msg} />);
        }
        )}
        {this.showForm()}
      </Container>
    );
  }
}

export default Subscribe;
