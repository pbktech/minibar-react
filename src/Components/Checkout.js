import React from 'react';
import { removeFromCart, setDeliveryDate, setLoginObject } from '../redux/actions/actions';
import { connect } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ScrollToTop from 'react-scroll-to-top';
import Messages from './Messages.js';
import * as utils from './Common/utils.js';
import {AddressLayout} from './Common/AddressLayout.js';
import PaymentInputs from './Common/PaymentInputs.js';
import Spinner from 'react-bootstrap/Spinner';
import Login from './Login.js';
import Input from 'react-phone-number-input/input';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import { formatPhoneNumber } from 'react-phone-number-input';
import Modal from 'react-bootstrap/Modal';
import { Redirect } from 'react-router-dom';

class Checkout extends React.Component {
  constructor(props, context) {
    super(props, context);
    const Config = require('../config.json');

    this.handleChange = this.handleChange.bind(this);
    this.setNewValue = this.setNewValue.bind(this);
    this.handlePhone = this.handlePhone.bind(this);
    this.setCard = this.setCard.bind(this);
    this.applyPromo = this.applyPromo.bind(this);
    this.checkPrices = this.checkPrices.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.setAddress = this.setAddress.bind(this);
    this.processSale = this.processSale.bind(this);
    this.luhn_checksum = this.luhn_checksum.bind(this);
    this.luhn_validate = this.luhn_validate.bind(this);
    this.addAddress = this.addAddress.bind(this);

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
      email: '',
      phoneNumber: '',
      guestName: '',
      show: false,
      smsConsent: true,
      emailConsent: false,
      billingName: '',
      promoCode: '',
      guestCredit: '',
      discount: [],
      orderNotReady: true,
      addressId: 0,
      orderGUID: '',
      checkGUID: '',
      toOrder: '',
      address: {
        type: 'billing',
        street: '',
        city: '',
        state: 'Illinois',
        zip: '',
      },
      card: {
        isValid: false,
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

  handleShow() {
    this.setState({ show: true });
  }

  handleClose() {
    this.setState({ show: false });
  }
  handlePhone(newValue) {
    this.setState({
      phoneNumber: newValue,
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
    utils.ApiPostRequest(this.state.API + 'checkout', confirm).then((data) => {
      if (data) {
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

  processSale() {
    let error = this.state.error;

    const confirm = { f: 'authorize',
      sessionID: this.props.loggedIn.sessionID,
      headerID: this.props.headerID,
      restaurant: this.props.delivery,
      order: this.props.cart,
      promoCode: this.state.promoCode,
      card: this.state.card,
      address: this.state.address,
      addressID: this.state.addressId,
      email: this.state.email,
      name: this.state.guestName,
      phone: this.state.phoneNumber,
      billingName: this.state.billingName,
      orderType: 'minibar',
      orderGUID: this.state.orderGUID,
      checkGUID: this.state.checkGUID,
      smsConsent: this.state.smsConsent,
      emailConsent: this.state.emailConsent,
      totals: {
        totalAmount: this.state.toastResponse.totalAmount,
        subtotal: this.state.toastResponse.amount,
        tax: this.state.toastResponse.taxAmount,
      }
    };

    utils.ApiPostRequest(this.state.API + 'checkout', confirm).then((data) => {
      if (data) {

        if (data.status === 'success') {
          this.props && this.props.cart.map((item, i) => {
            this.props.removeFromCart(parseInt(i, 10));
          });
          this.props && this.props.setDeliveryDate({
            location: '',
            guid: '',
            date: '',
            service: '',
            cutOffTime: '',
            deliveryDate: '',
            link: '',
            delservices: {},
            deliveryTime: '',
          });
          this.setState({
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
            show: false,
            smsConsent: true,
            emailConsent: false,
            billingName: '',
            promoCode: '',
            guestCredit: '',
            discount: [],
            orderNotReady: true,
            addressId: 0,
            orderGUID: '',
            checkGUID: '',
            toOrder: '/receipt/' + data.checkGUID,
            address: {
              isDeleted: 1,
              type: 'billing',
              street: '',
              city: '',
              state: 'Illinois',
              zip: '',
            },
            card: {
              isValid: false,
              type: '',
              cvc: '',
              cardNumber: '',
              expiryDate: '',
            },
        })
        }else{
          error.push({ msg: data.response, variant: 'danger' });
          this.setState({
            orderGUID: data.orderGUID,
            checkGUID: data.checkGUID,
          })
        }

        console.log(data);
      } else {
        error.push({ msg: 'An unexpected error occurred.', variant: 'danger' });
      }

      this.setState({
        error: error,
      });
    });
  }


  addAddress() {
    let error = this.state.error;

    const confirm = { f: 'addAddress',
      user: this.props.loggedIn.email,
      session: this.props.loggedIn.sessionID,
      address: this.state.address,
    };
    utils.ApiPostRequest(this.state.API + 'auth', confirm).then((data) => {
      if (data) {
        if (data.Variant &&  data.Variant === "success") {
          let addresses = [...this.props.loggedIn.addresses];
          let address = {...data.address};
          address.addressId = data.address;

          this.setState({
            addressID: address.addressId,
            address: address,
          }, () => {
            addresses.push(this.state.address);
            this.props.setLoginObject({
              ...this.props.loggedIn,
              addresses,
            });
          });

          this.handleClose();
        }else {
          error.push({ msg: data.message, variant: 'danger' });
        }
      } else {
        error.push({ msg: 'An unexpected error occurred.', variant: 'danger' });
      }

      this.setState({
        error: error,
      });
    });
  }


  setAddress(address) {
    const type = "billing";

    let street = this.state.address.street;
    let city = this.state.address.city;
    let state = this.state.address.state;
    let zip = this.state.address.zip;

    if(typeof(address) === 'string'){
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
        zip,
      },
    }, () => console.log(this.state.address));
  }

  setCard(card) {
    let isValid;
    let cvc = this.state.card.cvc;
    let number = this.state.card.number;
    let expiryDate = this.state.card.expiryDate;

    switch (card.target.name) {
      case 'expiryDate':
        expiryDate = card.target.value;
        break;
      case 'cardNumber':
        number = card.target.value.replaceAll(" ","");
        break;
      case 'cvc':
        cvc = card.target.value;
        break;
      default:
    }

    if (card.target.name === 'cardNumber' && this.luhn_validate(number)) {
      isValid = true;
    }else {
      isValid = false;
    }
    this.setState({
      card: {
        isValid,
        cvc,
        number,
        expiryDate,
      },
    });
  }

  luhn_checksum(code) {
    let len = code.length;
    let parity = len % 2;
    let sum = 0;
    for (let i = len-1; i >= 0; i--) {
      let d = parseInt(code.charAt(i));
      if (isNaN(d)) {
        continue;
      }

      if (i % 2 === parity) {
        d *= 2;
      }

      if (d > 9) {
        d -= 9;
      }

      sum += d;
    }
    return sum % 10
  }

  luhn_validate(fullcode) {
    return this.luhn_checksum(fullcode) === 0
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
    this.setState(newState, () => console.log(this.state));
  }
  render() {
    if (this.state.toOrder) {
      return (
          <Redirect from="/checkout" to={this.state.toOrder} />
      );
    }

    let totalDiscounts = 0;
    this.state.discount.length && this.state.discount.map((entry) => {
      totalDiscounts += entry.discountAmount;
    })
    const subTotal = parseFloat(this.state.toastResponse.amount) + parseFloat(totalDiscounts);

    return (
      <Container style={{ paddingTop: '1em' }} fluid >
        <Row>
          <Col>
            {this.props.loggedIn.guestName ? (<h2>Welcome {this.props.loggedIn.guestName}</h2>)
              : (
                <div>
                  <h2>Welcome Guest</h2>
                  <nav className="site-nav" style={{ textAlign: 'left' }}>
                    <ul className="site-nav-menu" data-menu-type="desktop" style={{ padding: '1em' }}>
                      <Login />
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
                  <Row>
                    <Col>
                      <Form.Row>
                        <Col>
                          <h3>Contact</h3>
                        </Col>
                      </Form.Row>
                      <Form.Row>
                        <Form.Group style={{ width: '100%' }} controlId="validationCustom03">
                          <Form.Label style={{fontWeight:"bold"}}>{this.props.loggedIn.guestName}</Form.Label>
                        </Form.Group>
                      </Form.Row>
                      <Form.Row>
                        <Form.Group style={{ width: '100%' }} controlId="validationCustom03">
                          <Form.Label style={{fontWeight:"bold"}}>{formatPhoneNumber('+1' + this.props.loggedIn.phone)}</Form.Label>
                        </Form.Group>
                      </Form.Row>
                      <Form.Row>
                        <Form.Group style={{ width: '100%' }} controlId="validationCustom03">
                          <Form.Label style={{fontWeight:"bold"}}>{this.props.loggedIn.email}</Form.Label>
                        </Form.Group>
                      </Form.Row>
                      <Form.Row>
                        <Form.Group as={Row}>
                          <Col md="12">
                            <Form.Check name="smsConsent" label="I consent to receive status updates about my order via SMS" onChange={this.handleChange} checked={this.state.smsConsent} />
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
                        <Button variant={"link"} onClick={this.handleShow}>
                          Add an address
                        </Button>
                        <Modal show={this.state.show} onHide={this.handleClose} >
                          <Modal.Header  closeButton ><Modal.Title as="h2">Add an address</Modal.Title></Modal.Header>
                          <Modal.Body>
                            <AddressLayout setAddress={this.setAddress} state={"Illinois"} address={this.state.address}/>
                          </Modal.Body>
                          <Modal.Footer>
                            <Button variant={"secondary"} onClick={this.handleClose}>Cancel</Button>
                            <Button variant={"brand"} onClick={this.addAddress}>Save</Button>
                          </Modal.Footer>
                        </Modal>
                      </Form.Row>
                      <div style={{maxHeight:"400px", overflowY:"auto"}}>
                      {this.props.loggedIn.addresses.length && this.props.loggedIn.addresses.map((entry, i) => {
                        return (
                            <div key={'option' + i} className="mb-3">
                              <Form.Check type="radio" id={`address-${i}`}>
                                <Form.Check.Input
                                    onChange={this.handleChange}
                                    name="addressId"
                                    type="radio"
                                    value={entry.addressID}
                                    checked={parseInt(this.state.addressId) === entry.addressID} />
                                <Form.Check.Label>
                                  {entry.street}<br/>{entry.city}, {entry.state}
                                </Form.Check.Label>
                              </Form.Check>
                            </div>
                        );
                      })

                      }
                      </div>
                    </Col>
                  </Row>
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
                            value={this.state.phoneNumber}
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
                      {this.state.toastResponse.amount > 0 ? (
                      <Col>
                        <Form.Row>
                        <Col>
                          <h3>Billing Address</h3>
                        </Col>
                      </Form.Row>
                        <Form.Row>
                          <Form.Group style={{ width: '100%' }} controlId="validationCustom03">
                            <Form.Label style={{fontWeight:"bold"}}>Card Name</Form.Label>
                            <Form.Control type="text" placeholder="" required name="billingName" onChange={this.handleChange} />
                            <Form.Control.Feedback type="invalid">
                              Please provide a valid billing name.
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Form.Row>
                        <>
                          <AddressLayout setAddress={this.setAddress} state={"Illinois"} address={this.state.address}/>
                        </>
                      </Col>
                          ):(<></>)}
                    </Row>
                  </>)}
                <Row>
                  {this.state.toastResponse.amount > 0 ? (
                    <Col>
                      <Form.Row>
                        <Col>
                          <h3>Credit Card</h3>
                        </Col>
                      </Form.Row>
                      <PaymentInputs setCard={this.setCard}/>
                    </Col>):(<></>)
                  }
                  <Col>
                    <Form.Row>
                      <Col>
                        <h3>Discounts</h3>
                      </Col>
                    </Form.Row>
                    <Form.Row>
                      {this.state.discount.length ?
                          (<>
                              <Form.Group as={Col} md="9" controlId="promocode">
                                <Form.Label style={{fontWeight:"bold"}}>Promo Code</Form.Label>
                                {this.state.discount.map((entry, i) => {
                                  return (<div key={'discount-' + i}>{entry.name + " (" + this.state.promoCode + ") applied"} </div>)
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
                              Apply
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
                              item.specialRequest && item.specialRequest !== '' ? (
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
                      <Row>
                        <Col className="col-sm-9">Subtotal:</Col><Col className="col-sm-3">${subTotal.toFixed(2)}</Col>
                      </Row>
                      {this.state.discount.length ?
                          (this.state.discount.map((entry, i) => {
                            totalDiscounts += entry.discountAmount;
                                return (
                                    <Row key={'row-discount-' + i} style={{ color: '#dc3545', fontStyle: 'italic' }}>
                                      <Col className="col-sm-9">{entry.name} ({this.state.promoCode})</Col><Col className="col-sm-3">${entry.discountAmount}</Col>
                                    </Row>)
                              })
                          )
                          :(<></>)
                      }
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
        <Row>
          <Col>
          <Button variant={"brand"} onClick={this.processSale} >Place Order</Button>
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
    headerID: state.headerID
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setDeliveryDate: (delivery) => {
      dispatch(setDeliveryDate(delivery));
    },
    setLoginObject: (loggedIn) => {
      dispatch(setLoginObject(loggedIn));
    },
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
