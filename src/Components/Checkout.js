import React from 'react';
import { removeFromCart } from '../redux/actions/actions';
import { connect } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ScrollToTop from 'react-scroll-to-top';
import Messages from './Messages.js';
import * as utils from '../utils.js';
import PaymentInputs from './Common/PaymentInputs.js';
import Spinner from 'react-bootstrap/Spinner';
import Login from './Login.js';
import { RegionDropdown } from 'react-country-region-selector';
import Input from 'react-phone-number-input/input';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';

class Checkout extends React.Component {
  constructor(props, context) {
    const Config = require('../config.json');

    super(props, context);
    const Config = require('../config.json');

    this.handleChange = this.handleChange.bind(this);
    this.setNewValue = this.setNewValue.bind(this);
    this.handlePhone = this.handlePhone.bind(this);
    this.setCard = this.setCard.bind(this);
    this.applyPromo = this.applyPromo.bind(this);
    this.checkPrices = this.checkPrices.bind(this);

    this.state = {
      Config,
      API: Config.apiAddress,
      toastResponse: {},
      toastSuccess: false,
      error: [],
      street: '',
      city: '',
      state: 'Illinois',
      zip: '',
      billAmount: 0.00,
      emailAddress: '',
      phoneNumber: '',
      guestName: '',
      smsConsent: true,
      emailConsent: false,
      billingName: '',
      promoCode: '',
      discount: [],
      card: {
        type: '',
        cvc: '',
        cardNumber: '',
        expiryDate: '',
      },
    };
  }

  componentDidMount() {
    const error = [];

    if (!this.props.cart || !this.props.cart.length) {
      error.push({ msg: 'It seems you do not have anything in your cart.', variant: 'danger' });
    }

    if (Object.entries(this.props.delivery).length === 0) {
      error.push({ msg: 'It seems you have not set a delivery date yet.', variant: 'danger' });
    }
    if (error.length === 0) {
      this.checkPrices();
    }

    if (error.length > 0) {
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({
        error,
      });
    }
  }

  handlePhone(newValue) {
    this.setState({
      phone: newValue,
    });
  }

  applyPromo() {

  }

  checkPrices() {
    let error = this.state.error;

    const confirm = { f: 'prices',
      restaurant: this.props.delivery,
      order: this.props.cart,
      promoCode: this.state.promoCode,
    };
    console.log(confirm)
    utils.ApiPostRequest(this.state.API + 'checkout', confirm).then((data) => {
      if (data) {
console.log('data');
console.log(data);
        if (data.discountAnswer.message){
          console.log(data.discountAnswer)
          error.push({ msg: data.discountAnswer.message, variant: data.discountAnswer.variant });
        }

        if (data.response) {
          this.setState({
            toastResponse: data.response,
            billAmount: data.response.amount,
            discount: data.response.appliedDiscounts,
          });
        }

      } else {
        error.push({ msg: 'An unexpected error occurred.', variant: 'danger' });
      }

      this.setState({
        error: error,
      });
    });
  }

  setCard(card) {
    let cvc = this.state.card.cvc;

    let number = this.state.card.number;

    let expiryDate = this.state.card.expiryDate;

    switch (card.target.name) {
      case 'expiryDate':
        expiryDate = card.target.value;
        break;
      case 'cardNumber':
        number = card.target.value;
        break;
      case 'cvc':
        cvc = card.target.value;
        break;
      default:
    }
    this.setState({
      card: {
        cvc,
        number,
        expiryDate,
      },
    }, () => console.log('card added'));
  }
  setNewValue(newValue) {
    this.setState({
      state: newValue,
    });
  }
  handleChange(e) {
    const name = e.target.name;
    const value = (e.target.type === 'checkbox') ? e.target.checked : e.target.value;

    const newState = {};

    newState[name] = value;
    this.setState(newState);
  }
  render() {
console.log('this.state.error');
console.log(this.state.error);
    return (
      <Container style={{ paddingTop: '1em' }} fluid >
        <Row>
          <Col>
            {this.props.loggedIn.guestName ? (<h2>Welcome {this.props.loggedIn.guestName}</h2>)
              : (
                <div>
                  <h2>Welcome Guest</h2>
                  <nav className="site-nav" style={{ textAlign: 'left' }}>
                    <ul className="site-nav-menu" data-menu-type="desktop">
                      <li style={{ padding: '1em' }}><Login /></li>
                    </ul>
                  </nav>
                </div>
              )}
          </Col>
        </Row>
        <Row>
          <Col className="col-sm-8">
            <Container>
              {this.state.error.length > 0 && this.state.error.map((entry, i) => {
                return (<Messages key={'message_' + i} variantClass={entry.variant} alertMessage={entry.msg} />);
              }
              )}
              <Form>
                {this.props.loggedIn.guestName ? (
                  <>
                  </>
                ) : (
                  <>
                    <Row>
                      <Col>
                        <Form.Row>
                        <Col>
                          <h3>Contact</h3>
                        </Col>
                      </Form.Row>
                        <Form.Row>
                        <Form.Group style={{ width: '100%' }} controlId="validationCustom03">
                          <Form.Label style={{fontWeight:"bold"}}>Your Name</Form.Label>
                          <Form.Control type="text" placeholder="" required name="guestName" onChange={this.handleChange} />
                          <Form.Control.Feedback type="invalid">
                            Please provide your name.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Form.Row>
                        <Form.Row>
                        <Form.Group style={{ width: '100%' }} controlId="validationCustom03">
                          <Form.Label style={{fontWeight:"bold"}}>Phone Number</Form.Label>
                          <Input
                            className="form-control"
                            country="US"
                            value={this.state.phone}
                            onChange={this.handlePhone} />
                        </Form.Group>
                      </Form.Row>
                        <Form.Row>
                        <Form.Group style={{ width: '100%' }} controlId="validationCustom03">
                          <Form.Label style={{fontWeight:"bold"}}>Email Address</Form.Label>
                          <Form.Control type="email" placeholder="" required name="email" onChange={this.handleChange} />
                          <Form.Control.Feedback type="invalid">
                            Please provide a valid email address.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Form.Row>
                        <Form.Row>
                        <Form.Group as={Row}>
                          <Col md="12">
                            <Form.Check name="smsConsent" label="I consent to receive status updates about my order via SMS" onChange={this.handleChange} checked={this.state.smsConsent} />
                            <Form.Check name="emailConsent" label="I consent to receive marketing emails from Protein Bar & Kitchen" onChange={this.handleChange} checked={this.state.emailConsent} />
                            <div id="emailHelp" className="text-muted">
                              We'll never share your email with anyone else.<br />
                              <small><a href="https://www.theproteinbar.com/privacy-policy/" target="_blank" rel="noopener noreferrer" >Protein Bar & Kitchen Privacy Policy</a></small>
                            </div>
                          </Col>
                        </Form.Group>
                      </Form.Row>
                      </Col>
                      <Col>
                        <Form.Row>
                        <Col>
                          <h3>Billing Address</h3>
                        </Col>
                      </Form.Row>
                        <Form.Row>
                        <Form.Group style={{ width: '100%' }} controlId="validationCustom03">
                          <Form.Label style={{fontWeight:"bold"}}>Card Name</Form.Label>
                          <Form.Control type="text" placeholder="Joe Schmoe" required name="billingName" onChange={this.handleChange} />
                          <Form.Control.Feedback type="invalid">
                            Please provide a valid billing name.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Form.Row>
                        <Form.Row>
                        <Form.Group style={{ width: '100%' }} controlId="validationCustom03">
                          <Form.Label style={{fontWeight:"bold"}}>Street Address</Form.Label>
                          <Form.Control type="text" placeholder="123 Main St" required name="street" onChange={this.handleChange} />
                          <Form.Control.Feedback type="invalid">
                            Please provide a valid street address.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Form.Row>
                        <Form.Row>
                        <Form.Group as={Col} md="6" controlId="validationCustom03">
                          <Form.Label style={{fontWeight:"bold"}}>City</Form.Label>
                          <Form.Control type="text" placeholder="" required name="city" onChange={this.handleChange} />
                          <Form.Control.Feedback type="invalid">
                            Please provide a valid city.
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md="3" controlId="validationCustom04">
                          <Form.Label style={{fontWeight:"bold"}}>State</Form.Label>
                          <RegionDropdown country="United States" classes="form-control" value={this.state.state} name="state" onChange={this.setNewValue} />
                          <Form.Control.Feedback type="invalid">
                            Please provide a valid state.
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md="3" controlId="validationCustom05">
                          <Form.Label style={{fontWeight:"bold"}}>Zip</Form.Label>
                          <Form.Control type="text" placeholder="Zip" required name="zip" onChange={this.handleChange} />
                          <Form.Control.Feedback type="invalid">
                            Please provide a valid zip.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Form.Row>
                      </Col>
                    </Row>
                  </>)}
                <Row>
                  <Col>
                    <Form.Row>
                      <Col>
                        <h3>Credit Card</h3>
                      </Col>
                    </Form.Row>
                    <PaymentInputs setCard={this.setCard} />
                  </Col>
                  <Col>
                    <Form.Row>
                      <Col>
                        <h3>Discounts</h3>
                      </Col>
                    </Form.Row>
                    {this.props.loggedIn.guestName ? (
                      <>
                        <Form.Row>
                          <Col>
                          <strong>Available Credits</strong>
                        </Col>
                        </Form.Row>
                        <Form.Row>
                          <Form.Group as={Row}>
                          <Col md="12">
                            <Form.Check type="radio" name="credit1" label="$20.00" />
                            <Form.Check type="radio" name="credit1" label="$2.29" />
                          </Col>
                        </Form.Group>
                        </Form.Row>
                      </>
                    ) : (<></>)}
                    <Form.Row>
                      {this.state.discount.length ?
                          (<>
                              <Form.Group as={Col} md="9" controlId="promocode">
                                <Form.Label style={{fontWeight:"bold"}}>Promo Code</Form.Label>
                                {this.state.discount.map((entry, i) => {
                                  return (<div>{entry.name + " applied"} </div>)
                                })}
                              </Form.Group></>
                          ):(
                              <>
                          <Form.Group as={Col} md="6" controlId="promocode">
                            <Form.Label style={{fontWeight:"bold"}}>Promo Code</Form.Label>
                            <Form.Control type="text" placeholder="" name="promoCode" onChange={this.handleChange}/>
                          </Form.Group>
                          <Form.Group as={Col} md="3" value={this.state.promoCode} controlId="button">
                            <Form.Label style={{fontWeight:"bold"}}><br/></Form.Label>
                            <Button variant="secondary" onClick={this.checkPrices} disabled={this.state.promoCode === ''}>
                              Add
                            </Button>
                          </Form.Group></>)
                      }
                    </Form.Row>
                  </Col>
                </Row>
              </Form>
            </Container>
            <ScrollToTop smooth color="#F36C21" />
          </Col>
          <Col className="col-sm-4" style={{ position: 'fixed' }}>
            <Container
              style={{
                borderLeft: '1px solid #dee2e6',
                height: '100vh',
                paddingLeft: '2em',
                position: 'fixed',
                top: '100px',
                right: '10px',
                width: '25%',
              }}>
              <h2>Your Order</h2>
              <hr />
              {!this.props.cart || !this.props.cart.length ? (<div  className="text-muted">Your cart is empty.</div>) : (
                this.state.toastResponse.entityType ? (
                  <div>
                    <div style={{ overflowY: 'auto', overflowX: 'hidden', height: '70vh' }}>
                      { this.props && this.props.cart.map((item, i) => {
                        return (
                          <Row key={'cartItem_' + i}>
                          <Col className="col-sm-9" key={i}>
                          {item.quantity} <strong>{item.name}</strong>
                          {item.forName !== '' ? (<div className="text-muted">{item.forName}</div>) : (<></>)}
                          <ul style={{ listStyleType: 'none' }}>
                            {item.mods && item.mods.map((mod) => {
                              return <li>{mod.modifier}</li>;
                            })}
                            {
                          item.specialRequest !== '' ? (
                            <li>Special Request: - <b>{item.specialRequest}</b></li>
                          ) : (<></>)
                          }
                          </ul>
                        </Col>
                        </Row>
                        );
                      })}
                    </div>
                    <div>
                      {this.state.discount.length ?
                        (this.state.discount.map((entry, i) => {
                              return (
                                  <Row style={{ color: '#dc3545' }}>
                                    <Col className="col-sm-9">{entry.name}</Col><Col className="col-sm-3">${entry.discountAmount}</Col>
                                  </Row>)
                            })
                        )
                        :(<></>)
                      }
                      <Row>
                        <Col className="col-sm-9">Subtotal:</Col><Col className="col-sm-3">${this.state.toastResponse.amount}</Col>
                      </Row>
                      <Row>
                        <Col className="col-sm-9">Tax:</Col><Col className="col-sm-3">${this.state.toastResponse.taxAmount}</Col>
                      </Row>
                      <Row>
                        <Col className="col-sm-9">Total Due:</Col><Col className="col-sm-3">${this.state.toastResponse.totalAmount}</Col>
                      </Row>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <div>Updating...</div>
                    <Spinner animation="border" role="status">
                      <span className="sr-only">Loading...</span>
                    </Spinner>
                  </div>
                )
              )}
            </Container>
          </Col>
        </Row>
      </Container>
    );
  }
}


const mapState = (state) => {
  return {
    cart: state.cart,
    delivery: state.delivery,
    loggedIn: state.loggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    removeFromCart: (item) => {
      dispatch(removeFromCart(item));
    },
  };
};

Checkout.propTypes = {
  cart: PropTypes.array.isRequired,
  delivery: PropTypes.object.isRequired,
  loggedIn: PropTypes.object.isRequired,
};

export default connect(mapState, mapDispatchToProps)(Checkout);
