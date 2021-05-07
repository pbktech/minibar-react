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
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import ContactInfo from './Checkout/ContactInfo';
import AddressManager from './Checkout/AddressManager';
import PaymentInfo from './Checkout/PaymentInfo';
import Suggest from './Checkout/Suggest';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

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
    this.addATip = this.addATip.bind(this);
    this.handleTip = this.handleTip.bind(this);

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
      tipState: '',
      tipAmount: 0,
      subTotal: 0,
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
    if (this.state.pcSubmitted) {
      return (
        <div style={{ textAlign: 'center' }}>
          <div>Updating...</div>
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      );
    }
    if (this.props.loggedIn.delivery && this.props.loggedIn.delivery.paymentHeader) {
      return (<div className="text-muted">Discounts not available for prepay orders.</div>);
    }
    if (this.state.discount && this.state.discount.length !== 0) {
      return (<Form.Group as={Col} md="9" controlId="promocode">
        <Form.Label style={{ fontWeight: 'bold' }}>Promo Code</Form.Label>
        {this.state.discount.map((entry, i) => {
          return (<div key={'discount-' + i}>{entry.name + ' (' + this.state.promoCode + ') applied'} </div>);
        })}
      </Form.Group>);
    }
    return (
      <Form.Row>
        <Form.Group as={Col} md="6" controlId="promocode">
          <Form.Label style={{ fontWeight: 'bold' }}>Promo Code</Form.Label>
          <Form.Control type="text" placeholder="" name="promoCode" onChange={this.handleChange} />
        </Form.Group>
        <Form.Group as={Col} md="3" value={this.state.promoCode} controlId="button">
          <Form.Label style={{ fontWeight: 'bold' }}><br /></Form.Label>
          <Button variant="secondary" onClick={this.checkPrices} disabled={this.state.promoCode === ''}>
            Apply
          </Button>
        </Form.Group>
      </Form.Row>
    );
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
        console.log(data)
        if (data.discountAnswer.message) {
          error.push({ msg: data.discountAnswer.message, variant: data.discountAnswer.variant });
        }

        if (data.response) {
          let newappliedPayment = 0.00;

          let billAmount = data.response.checks[0].totalAmount;

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

          let totalDiscounts = 0;

          this.state.discount && this.state.discount.length && this.state.discount.map((entry) => {
            totalDiscounts = totalDiscounts + entry.discountAmount;
          });

          const subTotal = parseFloat(data.response.amount) + parseFloat(totalDiscounts);

          this.setState({
            toastResponse: data.response,
            billAmount: parseFloat(billAmount),
            discount: data.response.checks[0].appliedDiscounts,
            appliedPayment: parseFloat(newappliedPayment),
            pcSubmitted: false,
            subTotal,
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
      tipState: this.state.tipState,
      tipAmount: this.state.tipAmount,
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
            tipState: '',
            tipAmount: 0,
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


  addATip() {
    if (this.props.delivery.outpostIdentifier === 'delivery' && this.state.billAmount !== 0) {
      return (
        <>
          <Form.Row style={{ width: '100%' }}>
            <Form.Group>
              <Form.Label style={{ fontWeight: 'bold' }}>Leave a tip for the driver</Form.Label>
              <ButtonGroup toggle>
                <ToggleButton variant="secondary" type="radio" name="tipState" onChange={this.handleTip} value={'10'} checked={this.state.tipState === '10'}>10%</ToggleButton>
                <ToggleButton variant="secondary" type="radio" name="tipState" onChange={this.handleTip} value={'15'} checked={this.state.tipState === '15'}>15%</ToggleButton>
                <ToggleButton variant="secondary" type="radio" name="tipState" onChange={this.handleTip} value={'20'} checked={this.state.tipState === '20'}>20%</ToggleButton>
                <ToggleButton variant="secondary" type="radio" name="tipState" onChange={this.handleTip} value={'custom'} checked={this.state.tipState === 'custom'}>Custom $</ToggleButton>
              </ButtonGroup>
            </Form.Group>
          </Form.Row>
          {this.state.tipState === 'custom'
            ? <Form.Row style={{ width: '100%', paddingBottom: '.5em' }}>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text id="btnGroupAddon">$</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  type="text"
                  name={'tipAmount'}
                  onChange={this.handleChange}
                  placeholder="Custom Tip"
                  aria-label="Input group example"
                  aria-describedby="btnGroupAddon" />
              </InputGroup>
            </Form.Row> : <></>}
        </>
      );
    }
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

  handleTip(e) {
    const tipState = e.target.value;

    if (tipState !== 'custom') {
      const tipAmount = parseFloat(this.state.toastResponse.checks[0].total) * parseFloat(tipState / 100);

      this.setState({
        tipAmount,
        tipState,
      });
    } else {
      this.setState({
        tipState,
      });
    }
  }

  render() {
    if (this.state.toOrder) {
      return (
        <Redirect from="/checkout" to={this.state.toOrder} />
      );
    }
    let totalDiscounts = 0;
    let grandTotal = 0;

    if (this.state.toastResponse.checks && this.state.toastResponse.checks[0].totalAmount) {
      grandTotal = parseFloat(this.state.toastResponse.checks[0].totalAmount) + parseFloat(this.state.tipAmount) - parseFloat(this.state.appliedPayment);
    }

    this.state.discount && this.state.discount.length && this.state.discount.map((entry) => {
      totalDiscounts = totalDiscounts + entry.discountAmount;
    });

    const subTotal = parseFloat(this.state.toastResponse.amount) + parseFloat(totalDiscounts);
    const finalTotal = parseFloat(this.state.toastResponse.totalAmount) + parseFloat(this.state.tipAmount);

    return (
      <Container style={{ paddingTop: '1em', fontFamily: 'Lora' }} fluid>
        <Suggest checkPrices={this.checkPrices} />
        <Row>
          <Col>
            <h2>Welcome {this.props.loggedIn.guestName ? this.props.loggedIn.guestName : 'Guest'}</h2>
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
                        {this.addATip()}
                        <PaymentInfo setCard={this.setCard} paymentHeader={this.props.loggedIn.delivery && this.props.loggedIn.delivery.paymentHeader} amount={this.state.billAmount} />
                      </Col>
                    </Form.Row>
                  </Col>
                  <Col>
                    <Form.Row>
                      <Col>
                        <h3>Discounts</h3>
                        {this.applyPromo()}
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
                        <Col className="col-sm-9">Subtotal:</Col><Col className="col-sm-3">${this.state.toastResponse.checks[0].amount.toFixed(2)}</Col>
                      </Row>
                      {this.state.discount && this.state.discount.length
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
                        <Col className="col-sm-9">Tax:</Col><Col className="col-sm-3">${this.state.toastResponse.checks[0].taxAmount.toFixed(2)}</Col>
                      </Row>
                      {this.state.tipAmount !== 0
                        ? <Row>
                          <Col className="col-sm-9">Tip:</Col><Col className="col-sm-3">${this.state.tipAmount.toFixed(2)}</Col>
                        </Row> : <></>}
                      {
                        this.state.appliedPayment !== 0 ? (
                          <>
                            <Row>
                              <Col className="col-sm-9">Total:</Col><Col className="col-sm-3">${finalTotal.toFixed(2)}</Col>
                            </Row>
                            <Row style={{ color: '#dc3545', fontStyle: 'italic' }}>
                              <Col className="col-sm-9">Applied Payment:</Col><Col className="col-sm-3">(${this.state.appliedPayment.toFixed(2)})</Col>
                            </Row>
                          </>
                        ) : (<></>)
                      }
                      <Row>
                        <Col className="col-sm-9">Total Due:</Col><Col className="col-sm-3">${grandTotal.toFixed(2)}</Col>
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
