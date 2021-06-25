import React from 'react';
import BeatLoader from 'react-spinners/ClipLoader';
import Messages from './Messages';
import PaymentInputs from './Common/PaymentInputs';
import Form from 'react-bootstrap/Form';
import * as utils from './Common/utils';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Input from 'react-phone-number-input/input';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert'

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
    this.setValidated = this.setValidated.bind(this);
    this.waitingList = this.waitingList.bind(this);

    this.state = {
      Config,
      API: Config.apiAddress,
      error: [],
      processing: false,
      exists: false,
      phoneNumber: '',
      emailAddress: '',
      validated: false,
      isFull: false,
      submitted: false,
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

  componentDidMount() {
    const confirm = {
      f: 'checkSubscribers',
    };

    utils.ApiPostRequest(this.state.API + 'subscribe', confirm).then((data) => {
      if (data.status && data.status === 200) {
        if (data.active >= 100) {
          this.setState({
            isFull: true,
          });
        }
      }
    });
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

  processForm(f) {
    const error = [];

    let submitted = false;

    let exists = false;

    if (!error.length) {
      this.setState({
        processing: true,
      });

      const confirm = {
        f,
        emailAddress: this.state.emailAddress,
        phoneNumber: this.state.phoneNumber,
        card: this.state.card,
      };

      utils.ApiPostRequest(this.state.API + 'subscribe', confirm).then((data) => {
        if (data) {
          if (data.status && (data.status === 401 || data.status === 200)) {
            if (data.status === 200) {
              submitted = true;
            }
            if (data.status === 401) {
              exists = true;
            }
          } else {
            error.push({ msg: 'There was an error saving your registration, please try again.', variant: 'danger' });
          }
        } else {
          error.push({ msg: 'An unexpected error occurred.', variant: 'danger' });
        }
        this.setState({
          exists,
          submitted,
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

  setValidated(change) {
    this.setState({
      validated: change,
    });
  }

  waitingList() {
    const handleSubmit = (event) => {
      const form = event.currentTarget;

      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      }
      this.setValidated(true);
      this.processForm('addWaitList');
    };

    return (
      <Form noValidate validated={this.state.validated} onSubmit={handleSubmit} >
        <Form.Row style={{ width: '100%' }}>
          <Form.Group as={Col}>
            <Form.Label style={{ fontWeight: 'bold' }}>Your Name</Form.Label>
            <Form.Control name={'billingName'} onChange={this.setCard} required value={this.state.card.billingName} />
            <Form.Control.Feedback type="invalid">Please enter your name</Form.Control.Feedback>
          </Form.Group>
        </Form.Row>
        <Form.Row style={{ width: '100%', fontFamily: 'Lora' }}>
          <Form.Group as={Col}>
            <Form.Label><strong>Your Email</strong></Form.Label>
            <Form.Control name={'emailAddress'} onChange={this.handleChange} value={this.state.emailAddress} required />
            <Form.Control.Feedback type="invalid">Please enter your email address</Form.Control.Feedback>
          </Form.Group>
        </Form.Row>
        <Form.Row style={{ width: '100%', fontFamily: 'Lora' }}>
          <Form.Group as={Col} controlId="creditCard" style={{ paddingTop: '1em', width: '100%' }}>
            <Button variant={'brand'} onClick={handleSubmit}>Subscribe</Button>
          </Form.Group>
        </Form.Row>
      </Form>
    );
  }

  showForm() {
    const handleSubmit = (event) => {
      const form = event.currentTarget;

      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        this.processForm('addSubscriber');
      }
      this.setValidated(true);
    };

    return (
      <Form noValidate validated={this.state.validated} onSubmit={handleSubmit} >
        <Form.Row style={{ width: '100%' }}>
          <Form.Group as={Col}>
            <Form.Label style={{ fontWeight: 'bold' }}>Your Name</Form.Label>
            <Form.Control name={'billingName'} onChange={this.setCard} required value={this.state.card.billingName} />
            <Form.Control.Feedback type="invalid">Please enter your name</Form.Control.Feedback>
          </Form.Group>
        </Form.Row>
        <Form.Row style={{ width: '100%', fontFamily: 'Lora' }}>
          <Form.Group as={Col}>
            <Form.Label><strong>Phone Number</strong><br /><span className={'text-muted'} style={{ color: '#818a91', fontSize: '.75rem', textIndent: '-1em' }}><em>Must match PBK rewards account</em></span></Form.Label>
            <Input
              className="form-control"
              country="US"
              value={this.state.phoneNumber}
              required
              onChange={this.handlePhone} />
            <Form.Control.Feedback type="invalid">Please enter your phone number</Form.Control.Feedback>
          </Form.Group>
        </Form.Row>
        <Form.Row style={{ width: '100%', fontFamily: 'Lora' }}>
          <Form.Group as={Col}>
            <Form.Label><strong>Your Email</strong><span className={'text-muted'} style={{ color: '#818a91', fontSize: '.75rem', textIndent: '-1em' }}><em>Must match PBK rewards account</em></span></Form.Label>
            <Form.Control name={'emailAddress'} onChange={this.handleChange} value={this.state.emailAddress} required />
            <Form.Control.Feedback type="invalid">Please enter your email address</Form.Control.Feedback>
          </Form.Group>
        </Form.Row>
        <Form.Row style={{ width: '100%', fontFamily: 'Lora' }}>
          <Form.Group as={Col} controlId="creditCard" style={{ paddingTop: '1em', width: '100%' }}>
            <PaymentInputs setCard={this.setCard} />
          </Form.Group>
        </Form.Row>
        <Form.Row style={{ width: '100%', fontFamily: 'Lora' }}>
          <Form.Group as={Col} controlId="creditCard" style={{ paddingTop: '1em', width: '100%' }}>
            <Button variant={'brand'} type="submit">Subscribe</Button>
          </Form.Group>
        </Form.Row>
        <Form.Row style={{ width: '100%', fontFamily: 'Lora', color: '#818a91', fontSize: '.75rem' }}>
          By clicking Subscribe, you authorize Protein Bar & Kitchen to charge the above entered credit card for the amount of the subscription
          plus applicable taxes on, or around, the 1st of every month
          and on or around the 1st of every subsequent month until the plan is cancelled.
          You also agree to abide by the <a href={'https://www.theproteinbar.com/subscribe/tou'} target={'_blank'}>Terms of Use</a>.
        </Form.Row>
      </Form>
    );
  }

  render() {
    return (
      <Alert variant={'info'}>Subscription Sign-up will be back soon!</Alert>
    );
    if (this.state.submitted) {
      return (
        <Alert variant={'success'}>Thank you for signing up!</Alert>
      );
    }
    if (this.state.exists) {
      return (
        <Alert variant={'info'}>You already have an active subscription.</Alert>
      );
    }

    if (this.state.isFull) {
      return (
        <Container>
          <Alert variant={'info'}>Oh no! We’ve temporarily sold out of subscriptions. Please sign up for our waiting list, and we’ll let you know as soon as Power Plan subscriptions become available.</Alert>
          {this.waitingList()}
        </Container>
      );
    }

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
