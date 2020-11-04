import React from 'react';
import { removeFromCart, setDeliveryDate, setLoginObject } from '../../redux/actions/actions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Form from 'react-bootstrap/Form';
import { formatPhoneNumber } from 'react-phone-number-input';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Input from 'react-phone-number-input/input';

class ContactInfo extends React.Component {
  constructor(props, context) {
    super(props, context);
    const Config = require('../../config.json');

    this.state = {
      Config,
      API: Config.apiAddress,
    }
  }

  render(){

    if(this.props.loggedIn.sessionID){
      return(
        <>
        <Form.Row>
          <Form.Group style={{ width: '100%' }} controlId="validationCustom03">
            <Form.Label style={{ fontWeight: 'bold' }}>{this.props.loggedIn.guestName}</Form.Label>
          </Form.Group>
        </Form.Row>
      <Form.Row>
        <Form.Group style={{ width: '100%' }} controlId="validationCustom03">
          <Form.Label style={{ fontWeight: 'bold' }}>{formatPhoneNumber(this.props.loggedIn.phone)}</Form.Label>
        </Form.Group>
      </Form.Row>
      <Form.Row>
        <Form.Group style={{ width: '100%' }} controlId="validationCustom03">
          <Form.Label style={{ fontWeight: 'bold' }}>{this.props.loggedIn.email}</Form.Label>
        </Form.Group>
      </Form.Row>
      <Form.Row>
        <Form.Group as={Row}>
          <Col md="12">
            <Form.Check name="smsConsent" label="I consent to receive status updates about my order via SMS" onChange={this.props.handleChange} checked={this.state.smsConsent} />
          </Col>
        </Form.Group>
      </Form.Row>
      </>
      )
    }else{
      return (
        <>
        <Form.Row>
          <Form.Group style={{ width: '100%' }} controlId="validationCustom03">
            <Form.Label style={{ fontWeight: 'bold' }}>Your Name</Form.Label>
            <Form.Control type="text" placeholder="" required name="guestName" onChange={this.props.handleChange} />
            <Form.Control.Feedback type="invalid">
              Please provide your name.
            </Form.Control.Feedback>
          </Form.Group>
        </Form.Row>
      <Form.Row>
        <Form.Group style={{ width: '100%' }} controlId="validationCustom03">
          <Form.Label style={{ fontWeight: 'bold' }}>Phone Number</Form.Label>
          <Input
            className="form-control"
            country="US"
            value={this.state.phoneNumber}
            onChange={this.props.handlePhone} />
        </Form.Group>
      </Form.Row>
      <Form.Row>
        <Form.Group style={{ width: '100%' }} controlId="validationCustom03">
          <Form.Label style={{ fontWeight: 'bold' }}>Email Address</Form.Label>
          <Form.Control type="email" placeholder="" required name="email" onChange={this.props.handleChange} />
          <Form.Control.Feedback type="invalid">
            Please provide a valid email address.
          </Form.Control.Feedback>
        </Form.Group>
      </Form.Row>
      <Form.Row>
        <Form.Group as={Row}>
          <Col style={{fontSize:'12px'}}>
            <Form.Check name="smsConsent" label="I consent to receive status updates about my order via SMS" onChange={this.props.handleChange} checked={this.props.smsConsent} />
            <Form.Check name="emailConsent" label="I consent to receive marketing emails from Protein Bar & Kitchen" onChange={this.props.handleChange} checked={this.props.emailConsent} />
            <div className="text-muted">
              We'll never share your information with anyone else.<br />
              <small><a href="https://www.theproteinbar.com/privacy-policy/" target="_blank" rel="noopener noreferrer" >Protein Bar & Kitchen Privacy Policy</a></small>
            </div>
          </Col>
        </Form.Group>
      </Form.Row>
      </>
      )
    }

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

ContactInfo.propTypes = {
  cart: PropTypes.array.isRequired,
  delivery: PropTypes.object.isRequired,
  loggedIn: PropTypes.object.isRequired,
};

export default connect(mapState, mapDispatchToProps)(ContactInfo);
