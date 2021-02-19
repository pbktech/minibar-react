import React from 'react';
import BeatLoader from 'react-spinners/ClipLoader';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { Marker } from '@react-google-maps/api';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import PropTypes from 'prop-types';
import * as utils from './Common/utils.js';
import Messages from './Messages.js';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { CartCss, pbkStyle } from './Common/utils';
import { AddressLayout } from './Common/AddressLayout.js';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { ArrowRightCircle, XCircle, CheckCircle } from 'react-bootstrap-icons';
import PaymentInputs from './Common/PaymentInputs';

const containerStyle = {
  width: '100%',
  height: '600px'
};
const center = {
  lat: 41.881832,
  lng: -87.623177
};

class Group extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: [],
      locations: {},
      selectedRestaurant: '',
      variantClass: '',
      show: false,
      validated: false,
      guestEmail: '',
      name: '',
      guestPhone: '',
      company: '',
      size: '',
      emailConsent: true,
      formSubmitted: false,
      fulfillmentType: 'pickup',
      menuType: 'lunch',
      deliveryDay: '',
      deliveryTime: '',
      guestName: '',
      businessName: '',
      ready: false,
      card: {
        isValid: false,
        type: '',
        cvc: '',
        cardNumber: '',
        expiryDate: '',
      },
      address: {
        street: '',
        city: '',
        state: 'Illinois',
        zip: ''
      }

    };

    this.setAddress = this.setAddress.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.validateAddress = this.validateAddress.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.clearValidated = this.clearValidated.bind(this);
    this.setValidated = this.setValidated.bind(this);
    this.nextButton = this.nextButton.bind(this);
    this.setPickup = this.setPickup.bind(this);
    this.setDelivery = this.setDelivery.bind(this);
    this.setLunch = this.setLunch.bind(this);
    this.setBreakfast = this.setBreakfast.bind(this);
    this.setCard = this.setCard.bind(this);
    this.luhnChecksum = this.luhnChecksum.bind(this);
    this.luhnValidate = this.luhnValidate.bind(this);

  }

  componentDidMount() {
    const confirm = {
      f: 'getRestaurants',
    };

    utils.ApiPostRequest(this.props.config.apiAddress + 'general', confirm).then((data) => {
      if (data) {
        this.setState({
          locations: data.restaurants
        });
      } else {
        this.setState({
          error: 'Sorry, an unexpected error occurred',
          variantClass: 'danger'
        });
      }
    });
  }


  setError(e) {
    this.setState({
      error: e
    });
  }

  setValidated() {
    this.setState({ validated: true });
  }

  handleClose() {
    this.setState({
      show: false,
      error: '',
      variantClass: '',
      validated: false,
      ready: false,
      fulfillment: 'pickup',
      menuType: 'lunch',
      selectedRestaurant: '',
      card: {
        isValid: false,
        type: '',
        cvc: '',
        cardNumber: '',
        expiryDate: '',
      },
      address: {
        street: '',
        city: '',
        state: 'Illinois',
        zip: ''
      }
    });
  }

  luhnChecksum(code) {
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

  luhnValidate(fullcode) {
    return this.luhnChecksum(fullcode) === 0;
  }

  setCard(card) {
    let isValid = this.state.card.isValid;

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

    if (card.target.name === 'cardNumber' && this.luhnValidate(cardNumber)) {
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

  handleChange(e) {
    const name = e.target.name;
    const value = (e.target.type === 'checkbox') ? e.target.checked : e.target.value;

    const newState = {};

    newState[name] = value;
    this.setState(newState);
  }

  clearValidated() {
    this.setState({ validated: false });
  }

  handleShow(e) {
    this.setState({
      show: true,
      selectedRestaurant: e.target.dataset.restaurant
    });
  }

  validateAddress(event) {
    const error = this.state.error;
    const form = event.currentTarget;

    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === false) {
      return;
    }
    this.setValidated();

    const request = {
      f: 'getDistance',
      address: this.state.address,
      restaurant: this.state.selectedRestaurant
    };

    utils.ApiPostRequest(this.props.config.apiAddress + 'general', request).then((data) => {
      if (data) {
        const distance = data.distance.split(' mi');

        if (distance[0] > 2) {
          error.push({ msg: 'Unfortunately, the address entered is outside of our delivery area.', variant: 'danger' });
        }
      } else {
        error.push({ msg: 'An unexpected error occurred.', variant: 'danger' });
      }
      this.setState({
        error
      });
    });
  }

  NoMatch({ location }) {
    return (
      <div className="error">
        Could not find <code>{location.pathname.substring(1)}</code>
      </div>
    );
  }

  setAddress(address) {
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
        street,
        city,
        state,
        zip
      }
    });
  }

  nextButton() {
    if (this.state.ready === true && this.state.guestName !== '') {
      return <Button variant={'outline-success'}><ArrowRightCircle size={32}/></Button>;
    }
    return '';
  }

  startButton() {
    if (this.state.ready === true && this.state.guestName !== '') {
      return <Button variant={'outline-success'}><CheckCircle size={32}/></Button>;
    }
    return '';
  }
  setLunch() {
    this.setState({
      menuType: 'lunch',
    });
  }

  setBreakfast() {
    this.setState({
      menuType: 'breakfast',
    });
  }

  setPickup() {
    this.setState({
      fulfillmentType: 'pickup',
      ready: true
    });
  }

  setDelivery() {
    this.setState({
      fulfillmentType: 'delivery',
      ready: false
    });
  }

  render() {
    if (this.state.locations.length && this.props.config) {
      return (
        <>
          <Modal show={this.state.show} onHide={this.handleClose} size={'xl'}>
            <Modal.Header><h2>Let's get started</h2></Modal.Header>
            <Modal.Body>
              {this.state.error.length !== 0 && this.state.error.map((entry, i) => {
                return (<Messages key={'message_' + i} variantClass={entry.variant} alertMessage={entry.msg}/>);
              }
              )}
              <Container fluid>
                <Form>
                  <Row>
                    <Form.Row style={{ width: '100%', paddingBottom: '.5em' }}>
                      <Col><strong>Pickup or Delivery?</strong></Col>
                      <Col><strong>What meal would you like?</strong></Col>
                    </Form.Row>
                    <Form.Row style={{ width: '100%' }}>
                      <Col>
                        <Form.Check type="radio" id={'fulfillment-pickup'}>
                          <Form.Check.Input type="radio" checked={this.state.fulfillmentType === 'pickup' ? true : false} onChange={this.setPickup}/>
                          <Form.Check.Label><h3>Pickup</h3></Form.Check.Label>
                        </Form.Check>
                      </Col>
                      <Col>
                        <Form.Check type="radio" id={'fulfillment-delivery'}>
                          <Form.Check.Input type="radio" checked={this.state.fulfillmentType === 'delivery' ? true : false} onChange={this.setDelivery}/>
                          <Form.Check.Label><h3>Delivery</h3></Form.Check.Label>
                        </Form.Check>
                      </Col>
                      <Col>
                        <Form.Check type="radio" id={'fulfillment-delivery'}>
                          <Form.Check.Input type="radio" checked={this.state.menuType === 'breakfast' ? true : false} onChange={this.setBreakfast}/>
                          <Form.Check.Label><h3>Breakfast</h3></Form.Check.Label>
                        </Form.Check>
                      </Col>
                      <Col>
                        <Form.Check type="radio" id={'fulfillment-delivery'}>
                          <Form.Check.Input type="radio" checked={this.state.menuType === 'lunch' ? true : false} onChange={this.setLunch}/>
                          <Form.Check.Label><h3>Lunch or Dinner</h3></Form.Check.Label>
                        </Form.Check>
                      </Col>
                    </Form.Row>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Row>
                        <Form.Group style={{ width: '100%' }} controlId="validationCustom03">
                          <Form.Label style={{ fontWeight: 'bold' }}>Your Name</Form.Label>
                          <Form.Control type="text" placeholder="Required" name="guestName" onChange={this.handleChange}/>
                        </Form.Group>
                      </Form.Row>
                      <Form.Row>
                        <Form.Group style={{ width: '100%' }} controlId="validationCustom03">
                          <Form.Label style={{ fontWeight: 'bold' }}>Your Email Address</Form.Label>
                          <Form.Control type="text" placeholder="Required" name="guestEmail" onChange={this.handleChange}/>
                        </Form.Group>
                      </Form.Row>
                      <Form.Row>
                        <Form.Group style={{ width: '100%' }} controlId="validationCustom03">
                          <Form.Label style={{ fontWeight: 'bold' }}>Business Name</Form.Label>
                          <Form.Control type="text" placeholder="Optional" name="businessName" onChange={this.handleChange}/>
                        </Form.Group>
                      </Form.Row>
                      {this.state.fulfillmentType && this.state.fulfillmentType === 'delivery' ? (
                        <>
                          <Form.Row>
                            <Form.Group style={{ width: '100%' }} controlId="validationCustom03">
                              <Form.Label style={{ fontWeight: 'bold' }}>Your Phone Number</Form.Label>
                              <Form.Control type="text" placeholder="Required" name="guestPhone" onChange={this.handleChange}/>
                            </Form.Group>
                          </Form.Row>
                          <AddressLayout setAddress={this.setAddress} state={'Illinois'}/>
                          <Form.Row>
                            <Button onClick={this.validateAddress}>Validate Address</Button>
                          </Form.Row>
                        </>
                      ) : (<></>)}
                    </Col>
                    <Col style={{ height: '100%' }}>
                      <Form.Row style={{ width: '100%' }}>
                        <Form.Group as={Col} controlId="creditCard" style={{ paddingTop: '1em', width: '100%' }}>
                          <PaymentInputs setCard={this.setCard} />
                        </Form.Group>
                      </Form.Row>
                      <Form.Row style={{ width: '100%' }}>
                        <Form.Group as={Col} controlId="emailAddresses" style={{ paddingTop: '1em', width: '100%' }}>
                          <Form.Label style={{ fontWeight: 'bold' }}>Let everyone know - Email Addresses</Form.Label>
                          <Form.Control as="textarea" placeholder={'Enter as many as you\'d like, separate with commas.'} name="emails" onChange={this.handleChange} rows={3}/>
                        </Form.Group>
                      </Form.Row>
                    </Col>
                  </Row>
                </Form>
              </Container>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline-danger" onClick={this.handleClose}>
                <XCircle size={32}/>
              </Button>
              {this.nextButton()}
            </Modal.Footer>
          </Modal>
          <CartCss/>
          <Container className="main-content" style={{ paddingTop: '1em', overflow: 'hidden' }} fluid>
            <Form.Row className="mapContainer">
              <Col className="col-sm-2" style={{ height: '600px' }}>
                <div className="locationList" style={{ height: '600px', overflowY: 'auto' }}>
                  {this.state.locations.length && this.state.locations.map((entry, i) => (
                    <div key={'location_' + i} className="locationListItem">
                      <Link to="#" data-restaurant={entry.GUID} onClick={this.handleShow}>
                        <h3 data-restaurant={entry.GUID} style={{ fontSize: '18px' }}>
                          {entry.restaurantName}
                        </h3>
                      </Link>
                      <div style={{ fontFamily: 'Lora', fontSize: '13px' }}>
                        {entry.address1}
                        <br/>
                        {entry.city}, {entry.state}{' '}
                        {entry.zip}
                      </div>
                      <div style={{ paddingTop: '1em' }}>
                        <Button variant="brand" data-restaurant={entry.GUID} onClick={this.handleShow}>
                          Order Now
                        </Button>
                      </div>
                      <hr className="locationListItem-break"/>
                    </div>
                  ))}
                </div>
              </Col>
              <Col className="col-sm-10" style={{ height: '600px' }}>
                <LoadScript googleMapsApiKey={this.props.config.mapAPI}>
                  <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
                    {this.state.locations.map((entry, i) => {
                      const latLong = entry.latLong.split(', ');

                      return (
                        <Marker
                          key={'marker_' + i}
                          title={entry.restaurantName}
                          position={{ lat: parseFloat(latLong[0]), lng: parseFloat(latLong[1]) }}
                          icon="/assets/images/38638pbkmrk.png"/>
                      );
                    })}
                  </GoogleMap>
                </LoadScript>
              </Col>
            </Form.Row>
          </Container>
        </>
      );
    }
    return (
      <div className="sweet-loading" style={{ textAlign: 'center' }}>
        <BeatLoader sizeUnit={'px'} size={150} color={pbkStyle.orange} loading={!this.props.locations.length}/>
      </div>
    );
  }
}

Group.propTypes = {
  config: PropTypes.object.isRequired,
  locations: PropTypes.array.isRequired,
  match: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    locations: state.locations,
    config: state.config
  };
};

export default connect(mapStateToProps, null)(Group);
