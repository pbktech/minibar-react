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
import { ArrowRightCircle, XCircle } from 'react-bootstrap-icons';

const containerStyle = {
  width: '100%',
  height: '600px',
};
const center = {
  lat: 41.881832,
  lng: -87.623177,
};

class Group extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: '',
      locations: {},
      variantClass: '',
      show: false,
      validated: false,
      email: '',
      name: '',
      phone: '',
      company: '',
      size: '',
      emailConsent: true,
      formSubmitted: false,
      fulfillmentType: '',
      deliveryDay: '',
      deliveryTime: '',
      ready: false,
      address: {
        street: '',
        city: '',
        state: 'Illinois',
        zip: '',
      },

    };

    this.setAddress = this.setAddress.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleRequestMB = this.handleRequestMB.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.clearValidated = this.clearValidated.bind(this);
    this.setValidated = this.setValidated.bind(this);
    this.nextButton = this.nextButton.bind(this);
    this.setPickup = this.setPickup.bind(this);
    this.setDelivery = this.setDelivery.bind(this);

  }

  componentDidMount() {
    const confirm = {
      f: 'getRestaurants',
    };
    utils.ApiPostRequest(this.props.config.apiAddress + 'general', confirm).then((data) => {
      if (data) {
        this.setState({
          locations: data.restaurants,
        });
      } else {
        this.setState({
          error: 'Sorry, an unexpected error occurred',
          variantClass: 'danger',
        });
      }
    });
  }


  setError(e) {
    this.setState({
      error: e,
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
      fulfillment: '',
      address: {
        street: '',
        city: '',
        state: 'Illinois',
        zip: '',
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

  handleShow() {
    this.setState({ show: true });
  }

  handleRequestMB(event) {
    const form = event.currentTarget;

    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === false) {
      return;
    }
    this.setValidated();

    const request = {
      f: 'requestmb',
      name: this.state.name,
      email: this.state.email,
      phone: this.state.phone,
      company: this.state.company,
      address: this.state.address,
      size: this.state.size,
      emailConsent: this.state.emailConsent,
    };

    utils.ApiPostRequest(this.state.API + 'general', request).then((data) => {
      if (data) {
        this.setState({
          formSubmitted: true,
          error: data.message,
          variantClass: data.Variant,
        });
      } else {
        this.setState({
          message: <div className="error">Sorry, an unexpected error occurred</div>,
        });
      }
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
        zip,
      },
    });
  }
  nextButton() {
    if (this.state.ready === true) {
      return <Button variant={'outline-success'} ><ArrowRightCircle size={32} /></Button>;
    }
    return '';
  }
  setPickup() {
    this.setState({
      fulfillmentType: 'pickup',
      ready: true,
    });
  }
  setDelivery() {
    this.setState({
      fulfillmentType: 'delivery',
      ready: false,
    });
  }

  render() {
    if (this.state.locations.length && this.props.config) {
      return (
        <>
          <Modal show={this.state.show} onHide={this.handleClose}>
            <Modal.Header><h2>Pickup or Delivery?</h2></Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Row>
                  <Form.Check type="radio" id={'fulfillment-pickup'}>
                    <Form.Check.Input type="radio" checked={this.state.fulfillmentType === 'pickup' ? true : false} onClick={this.setPickup} />
                    <Form.Check.Label><h3>Pickup</h3></Form.Check.Label>
                  </Form.Check>
                </Form.Row>
                <Form.Row>
                  <Form.Check type="radio" id={'fulfillment-delivery'} >
                    <Form.Check.Input type="radio" checked={this.state.fulfillmentType === 'delivery' ? true : false} onClick={this.setDelivery} />
                    <Form.Check.Label><h3>Delivery</h3></Form.Check.Label>
                  </Form.Check>
                </Form.Row>
                {this.state.fulfillmentType && this.state.fulfillmentType === 'delivery' ? (
                  <Container fluid>
                    <AddressLayout setAddress={this.setAddress} />
                    <Form.Row>
                      <Button>Validate Address</Button>
                    </Form.Row>
                  </Container>
                ) : (<></>)}
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline-danger" onClick={this.handleClose}>
                <XCircle size={32} />
              </Button>
              {this.nextButton()}
            </Modal.Footer>
          </Modal>
          {this.state.error ? (<Messages variantClass={this.state.variantClass} alertMessage={this.state.error} />) : (<></>)}
          <CartCss />
          <Container className="main-content" style={{ paddingTop: '1em', overflow: 'hidden' }} fluid>
            <Row className="mapContainer" >
              <Col className="col-sm-2" style={{ height: '600px' }}>
                <div className="locationList" style={{ height: '600px', overflowY: 'auto' }}>
                  {this.state.locations.map((entry, i) => (
                    <div key={'location_' + i} className="locationListItem">
                      <Link to="#" onClick={this.handleShow}>
                        <h3 style={{ fontSize: '18px' }}>
                          {entry.restaurantName}
                        </h3>
                      </Link>
                      <div style={{ fontFamily: 'Lora', fontSize: '13px' }}>
                        {entry.address1}
                        <br />
                        {entry.city}, {entry.state}{' '}
                        {entry.zip}
                      </div>
                      <div style={{ paddingTop: '1em' }}>
                        <Button variant="brand" onClick={this.handleShow}>
                          Order Now
                        </Button>
                      </div>
                      <hr className="locationListItem-break" />
                    </div>
                  ))}
                </div>
              </Col>
              <Col className="col-sm-10" style={{ height: '600px' }}>
                <LoadScript googleMapsApiKey={this.props.config.mapAPI}>
                  <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
                    {this.state.locations.map((entry, i) => {
                      const latLong = entry.latLong.split(', ');

                      return (
                        <Marker key={'marker_' + i} position={{ lat: parseFloat(latLong[0]), lng: parseFloat(latLong[1]) }} icon="/assets/images/38638pbkmrk.png" />
                      );
                    })}
                  </GoogleMap>
                </LoadScript>
              </Col>
            </Row>
          </Container>
        </>
      );
    }
    return (
      <div className="sweet-loading" style={{ textAlign: 'center' }}>
        <BeatLoader sizeUnit={'px'} size={150} color={pbkStyle.orange} loading={!this.props.locations.length} />
      </div>
    );
  }
}

Group.propTypes = {
  config: PropTypes.object.isRequired,
  locations: PropTypes.array.isRequired,
  match: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    locations: state.locations,
    config: state.config,
  };
};

export default connect(mapStateToProps, null)(Group);
