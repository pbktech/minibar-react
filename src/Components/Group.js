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
import { Link, Redirect } from 'react-router-dom';
import { ArrowRightCircle, XCircle, CheckCircle } from 'react-bootstrap-icons';
import PaymentInputs from './Common/PaymentInputs';
import Select from 'react-select';
import chroma from 'chroma-js';
import Alert from 'react-bootstrap/Alert';
import Input from 'react-phone-number-input/input';
import InputGroup from 'react-bootstrap/InputGroup';

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
      error: [],
      locations: {},
      selectedRestaurant: '',
      variantClass: '',
      show: false,
      validated: false,
      processing: false,
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
      maxOrder: '',
      guestName: '',
      businessName: '',
      closeTime: '',
      delDate: '',
      emails: '',
      buttonVariant: 'outline-secondary',
      ready: false,
      phoneNumber: '',
      card: {
        isValid: false,
        type: '',
        cvc: '',
        cardNumber: '',
        expiryDate: '',
      },
      toOrder: '',
      validAddress: false,
      addressMsg: '',
      addressVar: '',
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
    this.validateAddress = this.validateAddress.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.clearValidated = this.clearValidated.bind(this);
    this.setValidated = this.setValidated.bind(this);
    this.startButton = this.startButton.bind(this);
    this.setPickup = this.setPickup.bind(this);
    this.setDelivery = this.setDelivery.bind(this);
    this.setLunch = this.setLunch.bind(this);
    this.setBreakfast = this.setBreakfast.bind(this);
    this.setCard = this.setCard.bind(this);
    this.luhnChecksum = this.luhnChecksum.bind(this);
    this.luhnValidate = this.luhnValidate.bind(this);
    this.selectData = this.selectData.bind(this);
    this.handleDate = this.handleDate.bind(this);
    this.checkReady = this.checkReady.bind(this);
    this.showAddressMessage = this.showAddressMessage.bind(this);
    this.handlePhone = this.handlePhone.bind(this);
    this.modalFooter = this.modalFooter.bind(this);
    this.modalBody = this.modalBody.bind(this);
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

  handlePhone(newValue) {
    this.setState({
      phoneNumber: newValue,
    });
  }

  handleClose() {
    this.setState({
      show: false,
      error: [],
      variantClass: '',
      validated: false,
      ready: false,
      fulfillment: 'pickup',
      menuType: 'lunch',
      closeTime: '',
      selectedRestaurant: '',
      phoneNumber: '',
      processing: false,
      delDate: '',
      maxOrder: '',
      emails: '',
      card: {
        isValid: false,
        type: '',
        cvc: '',
        cardNumber: '',
        expiryDate: '',
      },
      validAddress: false,
      addressMsg: '',
      addressVar: '',
      address: {
        street: '',
        city: '',
        state: 'Illinois',
        zip: '',
      },
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
    this.setState(newState, () => this.checkReady());
  }

  clearValidated() {
    this.setState({ validated: false });
  }

  handleShow(e) {
    this.setState({
      show: true,
      selectedRestaurant: e.target.dataset.restaurant,
      closeTime: e.target.dataset.close,
    });
  }

  validateAddress() {
    if (!this.state.address.street || !this.state.address.city || !this.state.address.state || !this.state.address.zip){
      return;
    }

    const request = {
      f: 'getDistance',
      address: this.state.address,
      restaurant: this.state.selectedRestaurant,
    };

    utils.ApiPostRequest(this.props.config.apiAddress + 'general', request).then((data) => {
      if (data) {
        const distance = data.distance.split(' mi');

        if (distance[0] > 2) {
          this.setState({
            validAddress: false,
            addressMsg: 'This address is outside of our delivery area.',
            addressVar: 'danger',
          });
        } else {
          this.setState({
            validAddress: true,
            addressMsg: '',
            addressVar: '',
          });
        }
      }
    });
  }

  handleDate(e) {
    this.setState({
      delDate: e.value,
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
    }, () => this.validateAddress());
  }

  todaysDate() {
    const today = new Date();

    return today.getFullYear() + '-' + (((today.getMonth() + 1) < 10) ? '0' : '') + (today.getMonth() + 1) + '-' + ((today.getDate() < 10) ? '0' : '') + today.getDate();
  }

  selectData() {
    if (!this.state.closeTime) {
      return;
    }
    let asap,
      matches = this.state.closeTime.match(/(\d+):(\d+) (..)/),
      hrs, min;

    if (matches) {
      hrs = parseInt(matches[1], 10) + ((matches[3] === 'am') ? 0 : 12);
      min = parseInt(matches[2], 10);
      if (min < 10) {
        min = '0' + min;
      }
    }

    const close = Math.round(Date.parse(this.todaysDate() + ' ' + hrs + ':' + min) / 1000),
      dates = [];

    if (this.state.fulfillmentType === 'pickup') {
      asap = Math.round((Date.now() + (40 * 60000)) / 1000);
    } else if (this.state.fulfillmentType === 'delivery') {
      asap = Math.round((Date.now() + (90 * 60000)) / 1000);
    }

    for (let i = asap; i < close; i = i + 900) {
      const d = new Date(i * 1000);

      if (i === asap) {
        dates.push({ value: i, label: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' ASAP', color: utils.pbkStyle.orange });
      } else {
        dates.push({ value: i, label: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), color: utils.pbkStyle.orange });
      }
    }
    return dates;
  }

  checkReady() {
    let personal = false;

    let fulfillment = false;

    let credit = false;

    let delivery = false;

    if (this.state.guestName && this.state.guestEmail && this.state.phoneNumber) {
      personal = true;
    }

    // eslint-disable-next-line max-len
    if (this.state.fulfillmentType === 'pickup' || (this.state.fulfillmentType === 'delivery' && this.state.validAddress === true)) {
      fulfillment = true;
    }

    if (this.state.card.cardNumber && this.state.card.expiryDate && this.state.card.cvc) {
      credit = true;
    }

    if (this.state.delDate) {
      delivery = true;
    }

    if (personal && fulfillment && credit && delivery) {
      return <Button variant={'outline-success'} onClick={this.startButton}><CheckCircle size={32} /></Button>;
    }
    return <span className={'text-muted'} style={{ paddingRight: '.5rem' }}><CheckCircle size={32} /></span>;
  }

  modalFooter() {
    if (!this.state.processing) {
      return (<Modal.Footer>
        <Button variant="outline-danger" onClick={this.handleClose}>
          <XCircle size={32} />
        </Button>
        {this.checkReady()}
      </Modal.Footer>);
    }
    return (<></>);
  }

  modalBody() {
    if (this.state.processing) {
      return (
        <div className="sweet-loading" style={{ textAlign: 'center' }}>
          <BeatLoader sizeUnit={'px'} size={150} color={pbkStyle.orange} />
        </div>
      );
    }
    const colourStyles = {
      control: styles => ({ ...styles, backgroundColor: 'white' }),
      option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        const color = chroma(data.color);

        return {
          ...styles,
          backgroundColor: isDisabled
            ? null
            : isSelected
              ? data.color
              : isFocused
                ? color.alpha(0.1).css()
                : null,
          color: isDisabled
            ? data.color
            : isSelected
              ? chroma.contrast(chroma('#ccc'), 'white') > 2
                ? 'white'
                : 'black'
              : data.color,
          cursor: isDisabled ? 'not-allowed' : 'default',

          ':active': {
            ...styles[':active'],
            backgroundColor: !isDisabled && (isSelected ? data.color : color.alpha(0.3).css()),
          },
        };
      },
      input: styles => ({ ...styles }),
      placeholder: styles => ({ ...styles }),
      singleValue: (styles, { data }) => ({ ...styles }),
    };

    return (
      <Form>
        <Row>
          <Col>
            <Form.Row style={{ width: '100%', paddingBottom: '.5em' }}>
              <strong>Pickup or Delivery?</strong>
            </Form.Row>
            <Form.Row style={{ width: '100%' }}>
              <Col>
                <Form.Check type="radio" id={'fulfillment-pickup'}>
                  <Form.Check.Input type="radio" checked={this.state.fulfillmentType === 'pickup' ? true : false} onChange={this.setPickup} />
                  <Form.Check.Label><h3>Pickup</h3></Form.Check.Label>
                </Form.Check>
              </Col>
              <Col>
                <Form.Check type="radio" id={'fulfillment-delivery'}>
                  <Form.Check.Input type="radio" checked={this.state.fulfillmentType === 'delivery' ? true : false} onChange={this.setDelivery} />
                  <Form.Check.Label><h3>Delivery</h3></Form.Check.Label>
                </Form.Check>
              </Col>
            </Form.Row>
            <Form.Row>
              <Form.Group style={{ width: '100%' }} controlId="validationCustom03">
                <Form.Label style={{ fontWeight: 'bold' }}>Your Name</Form.Label>
                <Form.Control type="text" placeholder="Required" name="guestName" onChange={this.handleChange} />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group style={{ width: '100%' }} controlId="validationCustom03">
                <Form.Label style={{ fontWeight: 'bold' }}>Your Email Address</Form.Label>
                <Form.Control type="text" placeholder="Required" name="guestEmail" onChange={this.handleChange} />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group style={{ width: '100%' }} controlId="validationCustom03">
                <Form.Label style={{ fontWeight: 'bold' }}>Your Phone Number</Form.Label>
                <Input
                  className="form-control"
                  country="US"
                  placeholder="Required"
                  value={this.state.phoneNumber}
                  onChange={this.handlePhone} />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group style={{ width: '100%' }} controlId="validationCustom03">
                <Form.Label style={{ fontWeight: 'bold' }}>Business Name</Form.Label>
                <Form.Control type="text" placeholder="Optional" name="businessName" onChange={this.handleChange} />
              </Form.Group>
            </Form.Row>
            {this.state.fulfillmentType && this.state.fulfillmentType === 'delivery' ? (
              <>
                <AddressLayout setAddress={this.setAddress} state={'Illinois'} />
                {this.showAddressMessage()}
              </>
            ) : (<></>)}
          </Col>
          <Col>
            <Form.Row style={{ width: '100%' }}>
              <Form.Group style={{ width: '100%' }} controlId="selectBox">
                <Form.Label style={{ fontWeight: 'bold' }}>When Would You Like Your Order?</Form.Label>
                <Select
                  style={{ width: '100%' }}
                  defaultValue=""
                  styles={colourStyles}
                  onChange={this.handleDate}
                  options={this.selectData()} />
              </Form.Group>
            </Form.Row>
            <Form.Row style={{ width: '100%' }}>
              <Form.Label style={{ fontWeight: 'bold' }}>Max individual order amount</Form.Label>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text>$</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control type="text" name={'maxOrder'} ia-label="Amount (to the nearest dollar)" value={this.state.maxOrder} onChange={this.handleChange} placeholder={'Leave empty for no maximum'} />
                <InputGroup.Append>
                  <InputGroup.Text>.00</InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
            </Form.Row>
            <Form.Row style={{ width: '100%' }}>
              <PaymentInputs setCard={this.setCard} />
            </Form.Row>
            <Form.Row style={{ width: '100%', paddingBottom: '.5em' }}>
              <Form.Label style={{ fontWeight: 'bold' }}>Let everyone know - Email Addresses</Form.Label>
              <Form.Control as="textarea" placeholder={'Enter as many as you\'d like, separate with commas.'} name="emails" onChange={this.handleChange} rows={3} />
            </Form.Row>
          </Col>
        </Row>
      </Form>
    );
  }

  startButton() {
    this.setState({
      processing: true,
    });
    const error = this.state.error;
    const confirm = {
      f: 'getGroupOrderLink',
      address: this.state.address,
      deliveryTime: this.state.delDate,
      email: this.state.guestEmail,
      cutoff: this.state.cutoff,
      restaurantID: this.state.selectedRestaurant,
      guestName: this.state.guestName,
      fulfillmentType: this.state.fulfillmentType,
      card: this.state.card,
      phoneNumber: this.state.phoneNumber,
      emails: this.state.emails,
    };

    utils.ApiPostRequest(this.props.config.apiAddress + 'general', confirm).then((data) => {
      if (data.status && data.status === 200) {
        this.setState({
          toOrder: 'order/go/' + data.link,
        }, () => this.handleClose());
      } else {
        error.push({ msg: data.msg });
        this.setState({
          error,
          processing: false,
        });
        window.scrollTo(0, 0);
      }
    });
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
    });
  }

  setDelivery() {
    this.setState({
      fulfillmentType: 'delivery',
    });
  }

  showAddressMessage() {
    if (this.state.addressVar && this.state.addressMsg) {
      return (
        <Form.Row>
          <Alert variant={this.state.addressVar}>{this.state.addressMsg}</Alert>
        </Form.Row>);
    }
    return;
  }

  render() {
    if (this.state.toOrder) {
      return (
        <Redirect from="/" to={this.state.toOrder} />
      );
    }
    if (this.state.locations.length && this.props.config) {
      return (
        <>
          <Modal show={this.state.show} onHide={this.handleClose} size={'xl'}>
            <Modal.Header><h2>Let's get started</h2></Modal.Header>
            <Modal.Body>
              {this.state.error.length !== 0 && this.state.error.map((entry, i) => {
                return (<Messages key={'message_' + i} variantClass={'danger'} alertMessage={entry.msg} />);
              }
              )}
              <Container fluid>
                {this.modalBody()}
              </Container>
            </Modal.Body>
            {this.modalFooter()}
          </Modal>
          <CartCss />
          <Container className="main-content" style={{ paddingTop: '1em', overflow: 'hidden' }} fluid>
            <Form.Row className="mapContainer">
              <Col className="col-sm-2 location-header-spacer" style={{ height: '600px' }}>
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
                        <br />
                        {entry.city}, {entry.state}{' '}
                        {entry.zip}
                      </div>
                      <div style={{ paddingTop: '1em' }}>
                        <Button variant="brand" data-restaurant={entry.GUID} data-close={entry.hoursInfo} onClick={this.handleShow}>
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
                  <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
                    {this.state.locations.map((entry, i) => {
                      const latLong = entry.latLong.split(', ');

                      return (
                        <Marker
                          key={'marker_' + i}
                          title={entry.restaurantName}
                          position={{ lat: parseFloat(latLong[0]), lng: parseFloat(latLong[1]) }}
                          icon="/assets/images/38638pbkmrk.png" />
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
