import React from 'react';
import BeatLoader from 'react-spinners/ClipLoader';
import { GoogleMap, LoadScript, StandaloneSearchBox, Marker } from '@react-google-maps/api';
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
import { Redirect } from 'react-router-dom';
import { XCircle, CheckCircle } from 'react-bootstrap-icons';
import PaymentInputs from './Common/PaymentInputs';
import Select from 'react-select';
import chroma from 'chroma-js';
import Alert from 'react-bootstrap/Alert';
import Input from 'react-phone-number-input/input';
import InputGroup from 'react-bootstrap/InputGroup';
import { geocodeByLatLng } from 'react-google-places-autocomplete';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
      fulfillmentType: '',
      menuType: 'lunch',
      deliveryDay: '',
      deliveryTime: '',
      maxOrder: '',
      guestName: '',
      businessName: '',
      closeTime: '',
      openTime: '',
      delDate: '',
      delDay: new Date(),
      delInstructions: '',
      messageToUser: '',
      closedDays: [],
      emails: '',
      buttonVariant: 'outline-secondary',
      ready: false,
      phoneNumber: '',
      longitude: '',
      latitude: '',
      autoComplete: '',
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
        suite: '',
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
    this.autoCompleteAddress = this.autoCompleteAddress.bind(this);
    this.showAutoComplete = this.showAutoComplete.bind(this);
    this.setLatLong = this.setLatLong.bind(this);
    this.distance = this.distance.bind(this);
    this.showDatePicker = this.showDatePicker.bind(this);
    this.selectDate = this.selectDate.bind(this);
  }

  componentDidMount() {
    const locations = [];

    const coords = {};

    navigator.geolocation.getCurrentPosition((pos) => {
      coords.lat = pos.coords.latitude;
      coords.lng = pos.coords.longitude;

      if (coords.lat && coords.lng) {
        this.setLatLong(coords.lat, coords.lng);
        geocodeByLatLng({ lat: coords.lat, lng: coords.lng })
          .then((results) => {
            locations.push({ results });
          })
          .catch(error => console.error(error));
      }

      if (locations.length) {
        this.autoCompleteAddress(locations);
      }
    });

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


  setLatLong(latitude, longitude) {
    this.setState({
      longitude,
      latitude,
      show: true,
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
      fulfillment: '',
      menuType: 'lunch',
      closeTime: '',
      openTime: '',
      selectedRestaurant: '',
      phoneNumber: '',
      processing: false,
      delDate: '',
      delDay: new Date(),
      delInstructions: '',
      messageToUser: '',
      maxOrder: '',
      emails: '',
      longitude: '',
      latitude: '',
      autoComplete: '',
      fulfillmentType: '',
      closedDays: [],
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
        suite: '',
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
    const closedDays = e.target.dataset.closeddays.split(',');

    this.setState({
      fulfillmentType: e.target.dataset.fulfillment,
      selectedRestaurant: e.target.dataset.restaurant,
      closeTime: e.target.dataset.close,
      openTime: e.target.dataset.open,
      closedDays,
    });
  }

  validateAddress() {
    if (!this.state.address.street || !this.state.address.city || !this.state.address.state || !this.state.address.zip) {
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

    let suite = this.state.address.suite;

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
        case 'suite':
          suite = address.target.value;
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
        suite,
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
      hrs, min, open;

    if (matches) {
      hrs = parseInt(matches[1], 10) + ((matches[3] === 'am') ? 0 : 12);
      min = parseInt(matches[2], 10);
      if (min < 10) {
        min = '0' + min;
      }
    }

    const close = Math.round(Date.parse(this.todaysDate() + ' ' + hrs + ':' + min) / 1000),
      dates = [], today = new Date(), calendarDate = new Date(this.state.delDay);

    // eslint-disable-next-line max-len
    if (today.getUTCFullYear() + today.getUTCMonth() + today.getUTCDate() !== calendarDate.getUTCFullYear() + calendarDate.getUTCMonth() + calendarDate.getUTCDate()) {
      open = this.state.openTime;
    } else if (Date.now() > this.state.openTime) {
      open = Date.now();
    } else {
      open = this.state.openTime;
    }
    if (this.state.fulfillmentType === 'pickup') {
      asap = Math.round((open + (40 * 60000)) / 1000);
    } else if (this.state.fulfillmentType === 'delivery') {
      asap = Math.round((open + (90 * 60000)) / 1000);
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

    if (this.state.fulfillmentType) {
      return (
        <Form>
          <Row>
            <Col>
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
                  <AddressLayout address={this.state.address} setAddress={this.setAddress} state={'Illinois'} />
                  <Form.Row style={{ width: '100%' }}>
                    <Form.Group controlId={'deliveryInstructions'} style={{ width: '100%' }}>
                      <Form.Label style={{ fontWeight: 'bold' }}>Delivery Instructions/Notes</Form.Label>
                      <Form.Control as="textarea" placeholder={''} name="delInstructions" onChange={this.handleChange} rows={3} />
                    </Form.Group>
                  </Form.Row>
                  {this.showAddressMessage()}
                </>
              ) : (<></>)}
            </Col>
            <Col>
              <Form.Row style={{ width: '100%' }}>
                <Form.Group style={{ width: '100%' }}>
                  <Form.Label style={{ width: '100%', fontWeight: 'bold' }}>When Would You Like Your Order?</Form.Label>
                  <Row style={{ width: '100%' }}>
                    <Col style={{ width: '100%' }}>
                      {this.showDatePicker()}
                    </Col>
                    <Col style={{ width: '100%' }}><Select
                      style={{ width: '100%' }}
                      defaultValue=""
                      styles={colourStyles}
                      onChange={this.handleDate}
                      options={this.selectData()} />
                    </Col>
                  </Row>
                </Form.Group>
              </Form.Row>
              <Form.Row style={{ width: '100%' }}>
                <Form.Group>
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
                </Form.Group>
              </Form.Row>
              <PaymentInputs setCard={this.setCard} />
              <Form.Row style={{ width: '100%' }}>
                <Form.Group controlId="groupEmails" style={{ width: '100%' }}>
                  <Form.Label style={{ fontWeight: 'bold' }}>Let everyone know - Email Addresses</Form.Label>
                  <Form.Control as="textarea" style={{ width: '100%' }} placeholder={'Enter as many as you\'d like, separate with commas.'} name="emails" onChange={this.handleChange} rows={3} />
                </Form.Group>
              </Form.Row>
              <Form.Row style={{ width: '100%' }}>
                <Form.Group controlId="groupMessage" style={{ width: '100%' }}>
                  <Form.Label style={{ fontWeight: 'bold' }}>Add a note to your guests</Form.Label>
                  <Form.Control as="textarea" style={{ width: '100%' }} placeholder={''} name="messageToUser" onChange={this.handleChange} rows={3} />
                </Form.Group>
              </Form.Row>
              <Form.Row className={'text-muted'} style={{ fontSize: '10px' }}>
                You and your guests have 30 minutes to enter orders in to the system before your card is charged and all orders are sent to the restaurant.<br />
                Pickup orders will be ready about 10 minutes after orders are sent to the restaurant.<br />
                Delivery Orders will be delivered about 1 hour after the orders are sent to the restaurant.
              </Form.Row>
            </Col>
          </Row>
        </Form>
      );
    }

    const locations = [];

    this.state.locations.map((entry) =>{
      const loc = entry.latLong.split(', ');

      let dist = this.distance(parseFloat(this.state.latitude), parseFloat(this.state.longitude), parseFloat(loc[0]), parseFloat(loc[1]));

      dist = Math.round(dist * 10);
      locations.push({
        distance: dist / 10,
        address1: entry.address1,
        city: entry.city,
        state: entry.state,
        zip: entry.zip,
        restaurantName: entry.restaurantName,
        GUID: entry.GUID,
        hoursInfo: entry.hoursInfo,
        openTime: entry.openTime,
        phone: entry.phone,
        closedDays: entry.closedDays,
      });
    });

    if (locations.length) {
      locations.sort((a, b) => {
        return a.distance - b.distance;
      });
      return (
        <Container fluid>
          {
            locations.map((entry, i) => {
              return (
                <Row key={'restaurantRow_' + i} style={{ paddingTop: '1em' }}>
                  <Col className={'col-7'}>
                    <Row><h3>{entry.restaurantName}</h3></Row>
                    <Row>{entry.address1}<br />{entry.city} {entry.state}, {entry.zip}</Row>
                  </Col>
                  <Col className={'col-2'}>
                    <Button className={'brand'} data-restaurant={entry.GUID} data-close={entry.hoursInfo} data-open={entry.openTime} data-fulfillment={'pickup'} data-closeddays={entry.closedDays} onClick={this.handleShow}>Pickup</Button><br />
                    <i style={{ paddingTop: '.5em', color: utils.pbkStyle.teal, fontSize: '12px' }}>{entry.distance} mi away</i>
                  </Col>
                  {entry.distance < 2
                    ? <Col className={'col-2'}>
                      <Button className={'brand'} data-restaurant={entry.GUID} data-close={entry.hoursInfo} data-open={entry.openTime} data-closeddays={entry.closedDays} data-fulfillment={'delivery'} onClick={this.handleShow}>Delivery</Button>
                    </Col> : <></>}
                </Row>);
            })
          }
        </Container>
      );
    }
  }

  showDatePicker() {
    const isAvailable = date => !this.state.closedDays.includes(date.getDay().toString());

    return (
      <DatePicker
        selected={this.state.delDay}
        onChange={date => this.selectDate(date)}
        className={'form-control'}
        style={{ width: '100%' }}
        filterDate={isAvailable}
        minDate={new Date()} />);
  }

  selectDate(date) {
    this.setState({
      closeTime: '',
      openTime: '',
      delDay: '',
    });
    const confirm = {
      f: 'getRestaurantHours',
      restaurant: this.state.selectedRestaurant,
      date,
    };

    utils.ApiPostRequest(this.props.config.apiAddress + 'general', confirm).then((data) => {
      if (data && data.open && data.close) {
        this.setState({
          closeTime: data.close,
          openTime: data.open,
          delDay: new Date(date),
        });
      } else {
        this.setState({
          error: 'Sorry, an unexpected error occurred',
          variantClass: 'danger',
        });
      }
    });
  }

  distance(lat1, lon1, lat2, lon2) {
    if ((lat1 === lat2) && (lon1 === lon2)) {
      return 0;
    }
    const radlat1 = Math.PI * lat1 / 180;

    const radlat2 = Math.PI * lat2 / 180;

    const theta = lon1 - lon2;

    const radtheta = Math.PI * theta / 180;

    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;
    return dist;
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
      delInstructions: this.state.delInstructions,
      messageToUser: this.state.messageToUser,
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

  autoCompleteAddress(e) {
    const address = this.state.address;

    e[0].address_components.map((component) => {
      const componentType = component.types[0];

      switch (componentType) {
        case 'street_number': {
          address.street = component.long_name;
          break;
        }

        case 'route': {
          address.street = address.street + (' ' + component.short_name);
          break;
        }

        case 'postal_code': {
          address.zip = component.long_name;
          break;
        }

        case 'locality':
          address.city = component.long_name;
          break;

        case 'administrative_area_level_1': {
          address.state = component.short_name;
          break;
        }
      }
    });
    this.setState({
      address,
      longitude: e[0].geometry.location.lng(),
      latitude: e[0].geometry.location.lat(),
      show: true,
    });
  }

  showAutoComplete() {
    if (this.state.longitude && this.state.latitude) {
      return (<div>Located Address</div>);
    }
    const renderFunc = ({ getSuggestionItemProps, suggestions }) => (
      <div className="autocomplete-dropdown">
        {suggestions.map(suggestion => (
          <div {...getSuggestionItemProps(suggestion)}>
            {suggestion.description}
          </div>
        ))}
      </div>
    );
    const onLoad = ref => this.searchBox = ref;

    const onPlacesChanged = () => this.autoCompleteAddress(this.searchBox.getPlaces());

    return (
      <StandaloneSearchBox
        onLoad={onLoad}
        onPlacesChanged={
          onPlacesChanged
        }>
        <input
          type="text"
          placeholder="Enter your address to get started"
          className={'form-control'}
          style={{
            boxSizing: 'border-box',
            border: '1px solid ' + utils.pbkStyle.orange,
            width: '500px',
            padding: '0 12px',
            borderRadius: '5px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
            fontSize: '14px',
            outline: 'none',
            textOverflow: 'ellipses',
            position: 'absolute',
            left: '50%',
            marginLeft: '-120px',
          }} />
      </StandaloneSearchBox>);
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
            <Modal.Header><h2>Let's get your group {this.state.fulfillmentType} order started</h2></Modal.Header>
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
            <Row style={{ paddingTop: '1em' }}>
              <Col style={{ paddingLeft: '1em' }}>
                <Row style={{ paddingLeft: '1em' }}><h2>Group Ordering</h2></Row>
                <Row style={{ paddingLeft: '1em', fontFamily: 'Lora' }}>Use this system to order and pay for PBK for you and your team. We will also invite them to order their own food. Get started by entering your address below and find your closest restaurant.</Row>
              </Col>
            </Row>
            <Row className="mapContainer" style={{ paddingTop: '1em' }}>
              <Col className="col" style={{ height: '600px' }}>
                <LoadScript googleMapsApiKey={this.props.config.mapAPI} libraries={['places']}>
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
                    {this.showAutoComplete()}
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
