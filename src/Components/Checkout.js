import React from 'react';
import { removeFromCart } from '../redux/actions/actions';
import { connect } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ScrollToTop from 'react-scroll-to-top';
import Messages from './Messages.js'
import * as utils from '../utils.js';
import PaymentInputs from './Common/PaymentInputs.js'
import Spinner from 'react-bootstrap/Spinner'

class Checkout extends React.Component {
  constructor(props, context) {
    const Config = require('../config.json');

    super(props, context);
    this.state = {
      Config,
      API: Config.apiAddress,
      toastResponse:{},
      toastSuccess:false,
      error:[],
    }
  }

  componentDidMount() {
    let error = [];

    if (!this.props.cart || !this.props.cart.length) {
      error.push({msg:"I'm sorry, it seems you do not have anything in your cart.", variant: 'danger'});
    }

    if (Object.entries(this.props.delivery).length === 0) {
      error.push({msg:"I'm sorry, it seems you have not set a delivery date yet.", variant: 'danger'});
    }
    if(error.length < 0){
      let confirm = {"f":"prices",
      "restaurant":this.props.delivery,
      "order":this.props.cart
      }

      console.log(confirm)
      utils.ApiPostRequest(this.state.API+'checkout',confirm).then((data) => {
        if (data.response) {
          this.setState({
            toastResponse: data.response,
          });
          console.log(data)
        } else {
          error.push({msg:"I'm sorry, an unexpected error occurred.", variant: 'danger'});
          }
        });
      }

      if (error.length > 0) {
        this.setState({
          error: error
        });
      }
    }
    render() {
    return (
      <Container style={{ paddingTop: '1em' }} >
      <Row><Col><h2>Welcome {this.props.loggedIn.guestName ? (this.props.loggedIn.guestName):("Guest")}</h2></Col></Row>
      <Row>
        <Col className="col-sm-8">
          <Container>
          {this.state.error.length > 0 && this.state.error.map((entry, i) => {
            return (<Messages key={"message_"+i} variantClass={entry.variant} alertMessage={entry.msg} />)
            }
          )}
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
              {this.props.loggedIn.guestName ?
              (
                <>
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
              </Form.Row></>):(<></>)
            }
              <Form.Row>
                <Col>
                  <h5>Credit Card</h5>
                </Col>
              </Form.Row>
              <PaymentInputs />
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
          {this.state.toastResponse.entityType ? (
            <div>
              <div style={{overflowY:'auto',overflowX:'hidden', height:"70vh"}}>
              { this.props && this.props.cart.map((item, i) => {
                  return (
                    <Row key={"cartItem_"+i}>
                      <Col className="col-sm-9" key={i}>
                        {item.quantity} <strong>{item.name}</strong>
                        {item.forName!=="" ? (<div className="text-muted">{item.forName}</div>) : (<></>)}
                        <ul style={{ listStyleType: 'none' }}>
                          {item.mods && item.mods.map((mod) => {
                            return <li>{mod.modifier}</li>;
                          })}
                          {
                          item.specialRequest!=="" ? (
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
          ):(
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
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

export default connect(mapState, mapDispatchToProps)(Checkout);
