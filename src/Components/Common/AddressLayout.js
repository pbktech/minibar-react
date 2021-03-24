import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { RegionDropdown } from 'react-country-region-selector';
import React from 'react';
import PropTypes from 'prop-types';

export function AddressLayout(props) {
  return (
    <>
      <Form.Row>
        <Form.Group style={{ width: '100%' }} controlId="validationCustom03">
          <Form.Label style={{ fontWeight: 'bold' }}>Street Address</Form.Label>
          <Form.Control type="text" placeholder="" value={props.address.street} name="street" onChange={props.setAddress} />
          <Form.Control.Feedback type="invalid">
            Please provide a valid street address.
          </Form.Control.Feedback>
        </Form.Group>
      </Form.Row>
      <Form.Row>
        <Form.Group style={{ width: '100%' }} controlId="validationCustom03">
          <Form.Label style={{ fontWeight: 'bold' }}>Suite Number</Form.Label>
          <Form.Control type="text" placeholder="" value={props.address.suite} name="suite" onChange={props.setAddress} />
        </Form.Group>
      </Form.Row>
      <Form.Row>
        <Form.Group as={Col} md="6" controlId="validationCustom03">
          <Form.Label style={{ fontWeight: 'bold' }}>City</Form.Label>
          <Form.Control type="text" placeholder="" value={props.address.city} name="city" onChange={props.setAddress} />
          <Form.Control.Feedback type="invalid">
            Please provide a valid city.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="3" controlId="validationCustom04">
          <Form.Label style={{ fontWeight: 'bold' }}>State</Form.Label>
          <RegionDropdown country="United States" classes="form-control" value={props.state} name="state" onChange={props.setAddress} />
          <Form.Control.Feedback type="invalid">
            Please provide a valid state.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="3" controlId="validationCustom05">
          <Form.Label style={{ fontWeight: 'bold' }}>Zip</Form.Label>
          <Form.Control type="text" placeholder="Zip" value={props.address.zip} name="zip" onChange={props.setAddress} />
          <Form.Control.Feedback type="invalid">
            Please provide a valid zip.
          </Form.Control.Feedback>
        </Form.Group>
      </Form.Row>
    </>
  );
}

AddressLayout.propTypes = {
  setAddress: PropTypes.func.isRequired,
};
