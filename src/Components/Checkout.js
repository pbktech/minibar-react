import React from 'react';
import { PaymentInputsWrapper, usePaymentInputs } from 'react-payment-inputs';
import images from 'react-payment-inputs/images';
import { addToCart, removeFromCart } from '../redux/actions/actions';
import { connect } from 'react-redux';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Container from 'react-bootstrap/Container';
import Login from './Login.js';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Cookies from 'universal-cookie';
import Cart from './Cart';
import { Link } from 'react-router-dom';
import ScrollToTop from 'react-scroll-to-top';

export default function PaymentInputs() {
  const {
    meta,
    getCardNumberProps,
    getExpiryDateProps,
    getCVCProps,
  } = usePaymentInputs();
  const { erroredInputs, touchedInputs } = meta;

  document.body.style.overflow = 'scroll';
  return (
    <Container style={{ paddingTop: '1em' }} >
    <Row>
      <Col className="col-sm-8">
        <Container>
          <Form>
            <Form.Row>
              <Col>
                <h5>Contact</h5>
              </Col>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} md="6" controlId="validationCustom03">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control type="text" placeholder="" required />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid phone number.
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} md="6" controlId="validationCustom03">
                <Form.Label>Email Address</Form.Label>
                <Form.Control type="email" placeholder="" required />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid email address.
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Row}>
                <Col md="12">
                  <Form.Check name="smsconsent" label="I consent to receive status updates about my order via SMS" checked />
                  <Form.Check name="emailconsent" label="I consent to receive marketing emails from Protein Bar & Kitchen" />
                </Col>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Col>
                <h5>Billing Address</h5>
              </Col>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} md="6" controlId="validationCustom03">
                <Form.Label>City</Form.Label>
                <Form.Control type="text" placeholder="City" required />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid city.
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} md="3" controlId="validationCustom04">
                <Form.Label>State</Form.Label>
                <Form.Control type="text" placeholder="State" required />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid state.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="3" controlId="validationCustom05">
                <Form.Label>Zip</Form.Label>
                <Form.Control type="text" placeholder="Zip" required />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid zip.
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Col>
                <h5>Discounts</h5>
              </Col>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} md="6" controlId="promocode">
                <Form.Label>Promo Code</Form.Label>
                <Form.Control type="text" placeholder="" />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Col>
                <h5>Available Credits</h5>
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
            <Form.Row>
              <Col>
                <h5>Credit Card</h5>
              </Col>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} style={{ maxWidth: '15rem' }}>
                <Form.Label>Card number</Form.Label>
                <Form.Control

                  // Here is where React Payment Inputs injects itself into the input element.
                  {...getCardNumberProps()}

                  // You can retrieve error state by making use of the error & touched attributes in `meta`.
                  isInvalid={touchedInputs.cardNumber && erroredInputs.cardNumber}
                  placeholder="0000 0000 0000 0000" />
                <Form.Control.Feedback type="invalid">
                  {erroredInputs.cardNumber}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} style={{ maxWidth: '10rem' }}>
                <Form.Label>Expiration</Form.Label>
                <Form.Control {...getExpiryDateProps()} isInvalid={touchedInputs.expiryDate && erroredInputs.expiryDate} />
                <Form.Control.Feedback type="invalid">
                  {erroredInputs.expiryDate}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} style={{ maxWidth: '7rem' }}>
                <Form.Label>CVC</Form.Label>
                <Form.Control
                  {...getCVCProps()}
                  isInvalid={touchedInputs.cvc && erroredInputs.cvc}
                  placeholder="123" />
                <Form.Control.Feedback type="invalid">
                  {erroredInputs.cvc}
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
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
        <Row>
          <div className="site-nav" style={{ float: 'right' }}>
            <ul className="site-nav-menu" style={{ display: 'inline' }}>
              <li style={{ display: 'inline' }}>
                <Link to="/">Home</Link>
              </li>
              <li style={{ display: 'inline' }}>
                <Login />
              </li>
            </ul>
          </div>
        </Row>
        <h2>Your Order</h2>
        <hr />
        <Cart />
      </Container>
    </Col>
  </Row>
</Container>
  );
}
