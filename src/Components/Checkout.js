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
import Spinner from 'react-bootstrap/Spinner';
import Login from './Login.js';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import ContactInfo from './Checkout/ContactInfo';
import AddressManager from './Checkout/AddressManager';
import PaymentInfo from './Checkout/PaymentInfo';
import Discounts from './Checkout/Discounts';

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
    this.handleBilling = this.handleBilling.bind(this);

    this.state = {
      Config,
      API: Config.apiAddress,
      toastResponse: { amount: 0 },
      formSubmitted: false,
      toastSuccess: false,
      error: [],
      street: '',
      city: '',
      state: 'Illinois',
      zip: '',
      billAmount: 0.00,
      appliedPayment: 0,
      email: '',
      phoneNumber: '',
      guestName: '',
      show: false,
      smsConsent: true,
      emailConsent: false,
      billingName: '',
      promoCode: '',
      pcSubmitted: false,
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
    const error = this.state.error;

    if (this.state.promoCode !== '') {
      this.setState({ pcSubmitted: true });
    }
    const confirm = {
      f: 'prices',
      restaurant: this.props.delivery,
      order: this.props.cart,
      promoCode: this.state.promoCode,
    };

    utils.ApiPostRequest(this.state.API + 'checkout', confirm).then((data) => {
      if (data) {
        if (data.discountAnswer.message) {
          error.push({ msg: data.discountAnswer.message, variant: data.discountAnswer.variant });
        }

        if (data.response) {
          let newappliedPayment = 0.00;

          let billAmount = data.response.totalAmount;

          if (this.props.delivery.payerType && this.props.delivery.payerType === 'group') {
            newappliedPayment = data.response.totalAmount;
            billAmount = 0.00;
            if (this.props.delivery.maximumCheck && this.props.delivery.maximumCheck > 0) {
              if (this.props.delivery.maximumCheck > data.response.totalAmount) {
                newappliedPayment = data.response.totalAmount;
                billAmount = 0.00;
              } else {
                newappliedPayment = this.props.delivery.maximumCheck;
                billAmount = data.response.totalAmount - this.props.delivery.maximumCheck;
              }
            }
          }

          this.setState({
            toastResponse: data.response,
            billAmount: parseFloat(billAmount),
            discount: data.response.appliedDiscounts,
            appliedPayment: parseFloat(newappliedPayment),
            pcSubmitted: false,
          });
        }
      } else {
        error.push({ msg: 'An unexpected error occurred.', variant: 'danger' });
      }

      this.setState({
        error,
      });
    });
  }

  processSale() {
    const error = this.state.error;

    const confirm = {
      f: 'authorize',
      sessionID: this.props.loggedIn.sessionID,
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
      orderGUID: this.props.delivery.orderGUID,
      checkGUID: this.state.checkGUID,
      smsConsent: this.state.smsConsent,
      emailConsent: this.state.emailConsent,
      totals: {
        totalAmount: this.state.toastResponse.totalAmount,
        subtotal: this.state.toastResponse.amount,
        tax: this.state.toastResponse.taxAmount,
      },
    };

    this.setState({
      formSubmitted: true,
    });

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
          });
        } else {
          error.push({ msg: data.response, variant: 'danger' });
          this.setState({
            error,
            orderGUID: data.orderGUID,
            checkGUID: data.checkGUID,
            formSubmitted: false,
          });
        }
      } else {
        error.push({ msg: 'An unexpected error occurred.', variant: 'danger' });
        this.setState({
          error,
          formSubmitted: false,
        });
      }
    });
  }


  addAddress() {
    const error = this.state.error;

    const confirm = {
      f: 'addAddress',
      user: this.props.loggedIn.email,
      session: this.props.loggedIn.sessionID,
      address: this.state.address,
    };

    utils.ApiPostRequest(this.state.API + 'auth', confirm).then((data) => {
      if (data) {
        if (data.Variant && data.Variant === 'success') {
          const addresses = [...this.props.loggedIn.addresses];

          const address = { ...data.address };

          address.addressId = data.address;

          this.setState({
            addressId: data.addressID,
            address,
          }, () => {
            addresses.push(this.state.address);
            this.props.setLoginObject({
              ...this.props.loggedIn,
              addresses,
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
        error,
      });
    });
  }

  handleBilling(e) {
    this.setState({
      addressId: e.value,
    });
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
        zip,
      },
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
        expiryDate,
      },
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
    if (this.state.toOrder) {
      return (
        <Redirect from="/checkout" to={this.state.toOrder} />
      );
    }

    let totalDiscounts = 0;

    this.state.discount.length && this.state.discount.map((entry) => {
      totalDiscounts = totalDiscounts + entry.discountAmount;
    });
    const subTotal = parseFloat(this.state.toastResponse.amount) + parseFloat(totalDiscounts);

    return (
      <Container style={{ paddingTop: '1em', fontFamily: 'Lora' }} fluid>
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
                <Row>
                  <Col>
                    <Form.Row>
                      <Col>
                        <h3>Contact Information</h3>
                        <ContactInfo handleChange={this.handleChange} handlePhone={this.handlePhone} smsConsent={this.state.smsConsent} emailConsent={this.state.emailConsent} />
                      </Col>
                    </Form.Row>
                  </Col>
                  <Col>
                    <Form.Row>
                      <Col>
                        <h3>Billing Address</h3>
                        <AddressManager
                          addresses={this.props.loggedIn && this.props.loggedIn.addresses}
                          handleClose={this.handleClose}
                          handleShow={this.handleShow}
                          handleChange={this.handleChange}
                          show={this.state.show}
                          amount={this.state.billAmount}
                          handleBilling={this.handleBilling}
                          setAddress={this.setAddress}
                          billingName={this.state.billingName}
                          address={this.state.address} addressId={this.state.addressId} addAddress={this.addAddress} />
                      </Col>
                    </Form.Row>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Row>
                      <Col>
                        <h3>Payment</h3>
                        <PaymentInfo setCard={this.setCard} paymentHeader={this.props.loggedIn.delivery && this.props.loggedIn.delivery.paymentHeader} amount={this.state.billAmount} />
                      </Col>
                    </Form.Row>
                  </Col>
                  <Col>
                    <Form.Row>
                      <Col>
                        <h3>Discounts</h3>
                        <Discounts
                          pcSubmitted={this.state.pcSubmitted} handleChange={this.handleChange} paymentHeader={this.props.loggedIn.delivery && this.props.loggedIn.delivery.paymentHeader} checkPrices={this.checkPrices} promoCode={this.state.promoCode} discount={this.state.discount}
                          amount={this.state.billAmount} />
                      </Col>
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
              {this.props.delivery.maximumCheck && this.props.delivery.maximumCheck > 0 ? (
                <>
                  <div className={'text-muted'}><br />You have a check maximum of ${this.props.delivery.maximumCheck} with tax.</div>
                </>
              ) : (<></>)}
              <hr />
              {!this.props.cart || !this.props.cart.length ? (<div className="text-muted">Your cart is empty.</div>) : (
                this.state.toastResponse.entityType ? (
                  <div>
                    <div style={{ overflowY: 'auto', overflowX: 'hidden', height: '55vh' }}>
                      {this.props && this.props.cart.map((item, i) => {
                        return (
                          <Row key={'cartItem_' + i}>
                            <Col className="col-sm-9" key={i}>
                              {item.quantity} <strong>{item.name}</strong>
                              {item.forName !== '' ? (<div className="text-muted">{item.forName}</div>) : (<></>)}
                              <ul style={{ listStyleType: 'none' }}>
                                {item.mods && item.mods.map((mod,i) => {
                                  return <li key={"itemmod_" + i}>{mod.modifier}</li>;
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
                      <hr />
                      <Row>
                        <Col className="col-sm-9">Subtotal:</Col><Col className="col-sm-3">${subTotal.toFixed(2)}</Col>
                      </Row>
                      {this.state.discount.length
                        ? (this.state.discount.map((entry, i) => {
                          totalDiscounts = totalDiscounts + entry.discountAmount;
                          return (
                            <Row key={'row-discount-' + i} style={{ color: '#dc3545', fontStyle: 'italic' }}>
                              <Col className="col-sm-9">{entry.name} ({this.state.promoCode})</Col><Col className="col-sm-3">${entry.discountAmount.toFixed(2)}</Col>
                            </Row>);
                        })
                        )
                        : (<></>)
                      }
                      <Row>
                        <Col className="col-sm-9">Tax:</Col><Col className="col-sm-3">${this.state.toastResponse.taxAmount.toFixed(2)}</Col>
                      </Row>
                      {
                        this.state.appliedPayment !== 0 ? (
                          <>
                            <Row>
                              <Col className="col-sm-9">Total:</Col><Col className="col-sm-3">${this.state.toastResponse.totalAmount.toFixed(2)}</Col>
                            </Row>
                            <Row style={{ color: '#dc3545', fontStyle: 'italic' }}>
                              <Col className="col-sm-9">Applied Payment:</Col><Col className="col-sm-3">(${this.state.appliedPayment.toFixed(2)})</Col>
                            </Row>
                          </>
                        ) : (<></>)
                      }
                      <Row>
                        <Col className="col-sm-9">Total Due:</Col><Col className="col-sm-3">${this.state.billAmount.toFixed(2)}</Col>
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
            {this.state.formSubmitted === true ? (
              <Spinner animation="border" role="status">
                <span className="sr-only">Processing...</span>
              </Spinner>
            ) : (
              <Button variant={'brand'} onClick={this.processSale} disabled={this.state.formSubmitted}>Place Order</Button>
            )
            }
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
    headerID: state.headerID,
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
