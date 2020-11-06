import React from 'react';
import { removeFromCart, setDeliveryDate, setLoginObject } from '../../redux/actions/actions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Form from 'react-bootstrap/Form';
import { AddressLayout } from '../Common/AddressLayout.js';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Select from 'react-select';

class AddressManager extends React.Component {
  constructor(props, context) {
    super(props, context);
    const Config = require('../../config.json');
    this.addressList = this.addressList.bind(this);

    this.state = {
      Config,
      API: Config.apiAddress
    };
  }

  addressList() {
    const options = [];

    this.props.addresses && this.props.addresses.map((entry, i) => {
      options.push({ value: entry.addressID, label: entry.street + ' ' + entry.city + ', ' + entry.state + ' ' + entry.zip });
    });

    return options;
  }

  render() {
    if (this.props.amount === 0) {
      return (<></>);
    }

    if (this.props.loggedIn.sessionID) {
      return (
        <>
          <Form.Row>
            <Form.Group as={Col} controlId="billingAddress" style={{ paddingTop: '1em', width: '100%' }}>
              <Form.Label style={{ fontWeight: 'bold' }}>Select a billing address</Form.Label>
              <Select
                defaultValue=""
                options={this.addressList()}
                onChange={this.props.handleBilling}/>
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Label style={{ fontWeight: 'bold' }}>Or add a new address</Form.Label>
            <Button variant={'link'} onClick={this.props.handleShow}>
              Add an address
            </Button>
            <Modal show={this.props.show} onHide={this.props.handleClose}>
              <Modal.Header closeButton><Modal.Title as="h2">Add an address</Modal.Title></Modal.Header>
              <Modal.Body>
                <AddressLayout setAddress={this.props.setAddress} state={'Illinois'} address={this.props.address}/>
              </Modal.Body>
              <Modal.Footer>
                <Button variant={'secondary'} onClick={this.props.handleClose}>Cancel</Button>
                <Button variant={'brand'} onClick={this.props.addAddress}>Save</Button>
              </Modal.Footer>
            </Modal>
          </Form.Row>
        </>
      );
    } else {
      return (
        <>
          <Form.Row>
            <Form.Group style={{ width: '100%' }} controlId="validationCustom03">
              <Form.Label style={{ fontWeight: 'bold' }}>Card Name</Form.Label>
              <Form.Control type="text" placeholder="" required name="billingName" value={this.props.billingName} onChange={this.props.handleChange}/>
              <Form.Control.Feedback type="invalid">
                Please provide a valid billing name.
              </Form.Control.Feedback>
            </Form.Group>
          </Form.Row>
          <>
            <AddressLayout setAddress={this.props.setAddress} state={'Illinois'} address={this.props.address}/>
          </>
        </>
      );
    }

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
    }
  };
};

AddressManager.propTypes = {
  cart: PropTypes.array.isRequired,
  delivery: PropTypes.object.isRequired,
  loggedIn: PropTypes.object.isRequired
};

export default connect(mapState, mapDispatchToProps)(AddressManager);
