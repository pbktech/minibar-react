import React from 'react';
import { removeFromCart, setDeliveryDate, setLoginObject } from '../../redux/actions/actions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Form from 'react-bootstrap/Form';
import { AddressLayout } from '../Common/AddressLayout.js';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

class AddressManager extends React.Component {
  constructor(props, context) {
    super(props, context);
    const Config = require('../../config.json');

    this.state = {
      Config,
      API: Config.apiAddress,
    }
  }

  render(){
    if(this.props.amount === 0){
      return (<></>);
    }

    if(this.props.loggedIn.sessionID){
      return(
        <>
          <Form.Row>
            <Button variant={'link'} onClick={this.props.handleShow}>
              Add an address
            </Button>
            <Modal show={this.state.show} onHide={this.props.handleClose} >
              <Modal.Header closeButton ><Modal.Title as="h2">Add an address</Modal.Title></Modal.Header>
              <Modal.Body>
                <AddressLayout setAddress={this.props.setAddress} state={'Illinois'} address={this.props.address} />
              </Modal.Body>
              <Modal.Footer>
                <Button variant={'secondary'} onClick={this.props.handleClose}>Cancel</Button>
                <Button variant={'brand'} onClick={this.props.addAddress}>Save</Button>
              </Modal.Footer>
            </Modal>
          </Form.Row>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {this.props.loggedIn.addresses.length && this.props.loggedIn.addresses.map((entry, i) => {
              return (
                <div key={'option' + i} className="mb-3">
                  <Form.Check type="radio" id={`address-${i}`}>
                    <Form.Check.Input
                      onChange={this.handleChange}
                      name="addressId"
                      type="radio"
                      value={entry.addressID}
                      checked={parseInt(this.props.addressId) === entry.addressID} />
                    <Form.Check.Label>
                      {entry.street}<br />{entry.city}, {entry.state}
                    </Form.Check.Label>
                  </Form.Check>
                </div>
              );
            })

            }
          </div>

        </>
      )
    }else{
      return (
        <>
          <Form.Row>
            <Form.Group style={{ width: '100%' }} controlId="validationCustom03">
              <Form.Label style={{ fontWeight: 'bold' }}>Card Name</Form.Label>
              <Form.Control type="text" placeholder="" required name="billingName" onChange={this.props.handleChange} />
              <Form.Control.Feedback type="invalid">
                Please provide a valid billing name.
              </Form.Control.Feedback>
            </Form.Group>
          </Form.Row>
          <>
            <AddressLayout setAddress={this.props.setAddress} state={'Illinois'} address={this.props.address} />
          </>
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

AddressManager.propTypes = {
  cart: PropTypes.array.isRequired,
  delivery: PropTypes.object.isRequired,
  loggedIn: PropTypes.object.isRequired,
};

export default connect(mapState, mapDispatchToProps)(AddressManager);
