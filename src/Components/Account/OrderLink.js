import React from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Messages from '../Messages.js';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import * as utils from '../Common/utils.js';
import InputGroup from 'react-bootstrap/InputGroup';
import Select from 'react-select';
import chroma from 'chroma-js';
import { setLoginObject } from '../../redux/actions/actions';
import { connect } from 'react-redux';
import Row from 'react-bootstrap/Row';
import PaymentInputs from '../Common/PaymentInputs.js';
import FormControl from 'react-bootstrap/FormControl';
import Spinner from 'react-bootstrap/Spinner';
import Col from 'react-bootstrap/Col';

class OrderLink extends React.Component {
  constructor(props, context) {
    super(props, context);
    const Config = require('../../config.json');

    this.selectData = this.selectData.bind(this);
    this.handleNewLink = this.handleNewLink.bind(this);
    this.setValidated = this.setValidated.bind(this);
    this.clearValidated = this.clearValidated.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.setCard = this.setCard.bind(this);
    this.luhn_checksum = this.luhn_checksum.bind(this);
    this.luhn_validate = this.luhn_validate.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.addressList = this.addressList.bind(this);
    this.handleBilling = this.handleBilling.bind(this);
    this.handleDate = this.handleDate.bind(this);
    this.locationList = this.locationList.bind(this);
    this.resetState = this.resetState.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.accountList = this.accountList.bind(this);
    this.handleHouseAccount = this.handleHouseAccount.bind(this);

    this.state = {
      Config,
      API: Config.apiAddress,
      validated: false,
      message: '',
      miniBar: '',
      payer: false,
      maxOrder: 0,
      presetOrderSize: false,
      formSubmitted: false,
      paymentType: 'card',
      houseAccount: '',
      useHouseAccount: false,
      guestName: '',
      showEmail: true,
      emails: '',
      address: '',
      delDate: '',
      card: {
        isValid: false,
        type: '',
        cvc: '',
        cardNumber: '',
        expiryDate: '',
      },
    };
  }

  clearValidated() {
    this.setState({ validated: false });
  }

  setValidated() {
    this.setState({ validated: true });
  }

  handleSelect(e) {
    this.setState({
      miniBar: e.value,
    });
  }

  handleDate(e) {
    this.setState({
      delDate: e.value,
    });
  }

  handleHouseAccount(e){
    const res=e.value.split('%%')
    this.setState({
      houseAccount: res[0],
      maxOrder: res[1],
    });
  }

  handleBilling(e) {
    this.setState({
      address: e.value,
    });
  }

  luhn_checksum(code) {
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

  luhn_validate(fullcode) {
    return this.luhn_checksum(fullcode) === 0;
  }

  setCard(card) {
    let isValid = this.state.card.isValid;

    let cvc = this.state.card.cvc;

    let number = this.state.card.number;

    let expiryDate = this.state.card.expiryDate;

    switch (card.target.name) {
      case 'expiryDate':
        expiryDate = card.target.value;
        break;
      case 'cardNumber':
        number = card.target.value.replaceAll(' ', '');
        break;
      case 'cvc':
        cvc = card.target.value;
        break;
      default:
    }

    if (card.target.name === 'cardNumber' && this.luhn_validate(number)) {
      isValid = true;
    } else {
      isValid = false;
    }
    this.setState({
      card: {
        isValid,
        cvc,
        number,
        expiryDate,
      },
    });
  }

  handleChange(e) {
    const name = e.target.name;
    const value = (e.target.type === 'checkbox') ? e.target.checked : e.target.value;
    const newState = {};

    if(name === 'useHouseAccount' && this.props.loggedIn.houseAccounts.length === 1){
      if(e.target.checked === true){
        newState['houseAccount'] = this.props.loggedIn.houseAccounts[0].guid;
        if(this.props.loggedIn.houseAccounts[0].maxIndividualOrder && this.props.loggedIn.houseAccounts[0].maxIndividualOrder > 0){
          newState['maxOrder'] = this.props.loggedIn.houseAccounts[0].maxIndividualOrder ;
        }
      }else {
        newState['houseAccount'] = '';
      }
    }

    newState[name] = value;
    this.setState(newState);
  }

  handleNewLink(event) {
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      return;
    }else{
      this.setState({ formSubmitted: true });
    }
    this.setValidated();
    const res = this.state.delDate.split('-');
    const request = {
      f: 'grouplink',
      payer: this.state.payer,
      service: res[0],
      link: res[4],
      cutoff: res[2],
      deliveryDate: res[1],
      deliveryTime: res[3],
      maxOrder: this.state.maxOrder,
      useHouseAccount: this.state.useHouseAccount,
      card: this.state.card,
      houseAccount: this.state.houseAccount,
      session: this.props.loggedIn.sessionID,
      emails: this.state.emails,
      user: this.props.loggedIn.email,
      billingName: this.state.guestName,
      billingID: this.state.address,
    };

    utils.ApiPostRequest(this.state.API + 'auth', request).then((data) => {
      if (data.status && data.status === 200) {
        const groupLinks = [...this.props.loggedIn.groupLinks];

        const groupLink = {
          linkHEX: data.link,
          orderDate: res[1],
          mbService: res[0],
          linkSlug: res[4],
        };

        groupLinks.push(groupLink);
        this.props.setLoginObject({
          ...this.props.loggedIn,
          groupLinks,
        });

        this.resetState();

      } else {
        this.setState({
          message: data.msg,
          formSubmitted: false,
        });
      }
    });
  }

  resetState(){
    this.setState({
      error: [],
      miniBar: '',
      payer: false,
      maxOrder: 0,
      formSubmitted: false,
      paymentType: 'card',
      houseAccount: '',
      useHouseAccount: false,
      guestName: '',
      showEmail: true,
      emails: '',
      address: '',
      delDate: '',
      card: {
        isValid: false,
        type: '',
        cvc: '',
        cardNumber: '',
        expiryDate: '',
      },
    }, () => {
      this.props.handleClose();
    })  ;

  }
  closeModal(){
    this.props.handleClose();
  }

  accountList() {
    const options = [];

    this.props.loggedIn.houseAccounts.length && this.props.loggedIn.houseAccounts.map((entry, i) => {
      options.push({ value: entry.guid + '%%' + entry.maxIndividualOrder, label: entry.companyName });
    });

    return options;
  }

  addressList() {
    const options = [];

    this.props.addresses && this.props.addresses.map((entry, i) => {
      options.push({ value: entry.addressID, label: entry.street + ' ' + entry.city + ', ' + entry.state + ' ' + entry.zip, color: utils.pbkStyle.orange });
    });

    return options;
  }

  locationList(){
    const options = [];
    this.props.locations && this.props.locations.map((entry, i) => {
      options.push({ value: entry.link, label: entry.name});
    })
    return options;
  }

  selectData() {
    const optionGroups = [];

    this.props.locations && this.props.locations.filter((location) => location.link === this.state.miniBar).map((entry, i) => {

      entry.services.map((service, ia) => {
        const options = [];
        service.orderDates.length && service.orderDates.map((orderDate, ib) => {
          const parseOrderDate = orderDate.split(' - ');

          let actualOrderDate = '';

          if (parseOrderDate[1]) {
            actualOrderDate = parseOrderDate[1];
          } else {
            actualOrderDate = orderDate;
          }
          options.push({ value: service.name + '-' + actualOrderDate + '-' + service.cutOffTime + '-' + service.deliveryTime + '-' + entry.link + '-' + i + '-' + ia, label: actualOrderDate, color: utils.pbkStyle.orange });
        });
        optionGroups.push({ value: '', label: service.name + ' order by ' + service.cutOffTime + ' to be delivered at ' + service.deliveryTime, color: utils.pbkStyle.orange, options });
      });
    });
    return optionGroups;
  }


  render() {
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
      <Modal show={this.props.show} onHide={this.resetState} size={"lg"}>
        <Modal.Header><Modal.Title as="h2">Create a group order</Modal.Title></Modal.Header>
        <Modal.Body>
          <Container style={{ fontFamily: 'Lora' }} fluid>
            {this.state.message ? (<Messages variantClass={"danger"} alertMessage={this.state.message} />):(<></>)}
            <Form validated={this.state.validated} >
              <Form.Row style={{width:"100%"}}>
              <Form.Group as={Col} controlId="mbSelect"  style={{ paddingTop: '1em',width:"100%" }}>
                <Form.Label style={{ fontWeight: 'bold' }}>Select a delivery location</Form.Label>
                <Select
                  defaultValue=""
                  options={this.locationList()}
                  onChange={this.handleSelect} />
              </Form.Group>
              </Form.Row>
              {this.state.miniBar ? (
                <Form.Row style={{width:"100%"}}>
                <Form.Group as={Col} controlId="dateSelect"  style={{ paddingTop: '1em',width:"100%" }}>
                  <Form.Label style={{ fontWeight: 'bold' }}>Select a delivery date and time</Form.Label>
                  <Select
                    defaultValue=""
                    options={this.selectData()}
                    styles={colourStyles}
                    onChange={this.handleDate}/>
                </Form.Group>
                </Form.Row>):(<></>)
              }
              <Form.Row style={{width:"100%"}}>
              <Form.Group as={Col} style={{ padding: '1em' }}>
                <Form.Check
                  type="checkbox"
                  id="payer"
                  name="payer"
                  label="I will pay for this group order"
                  value="group"
                  onChange={this.handleChange} />
              </Form.Group>
              </Form.Row>
              {this.state.payer === true ? (
                <>

                <Form.Row style={{width:"100%"}}>
                  <Form.Label style={{ fontWeight: 'bold' }}>Max individual order amount</Form.Label>
                  {this.state.presetOrderSize === false ? (
                  <InputGroup style={{ width: '50%' }} >
                    <InputGroup.Prepend>
                      <InputGroup.Text>$</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl aria-label="Amount (to the nearest dollar)" style={{ width: '50px' }} value={this.state.maxOrder} placeholder={"Leave empty for no maximum"}/>
                    <InputGroup.Append>
                      <InputGroup.Text>.00</InputGroup.Text>
                    </InputGroup.Append>
                  </InputGroup>
                  ):(<div className="text-muted" >Preset to ${this.state.maxOrder}</div>)}
                </Form.Row>
                  {this.props.loggedIn.houseAccounts.length !== 0 ? (
                    <>
                      <Form.Row style={{width:"100%"}}>
                      <Form.Group  style={{ padding: '1em' }}>
                        <Form.Check
                          type="checkbox"
                          id="useHouseAccount"
                          name="useHouseAccount"
                          label="Use House Account?"
                          onChange={this.handleChange} />
                      </Form.Group>
                      </Form.Row>
                    </>
                  ) : (<></>)

                }
                  {this.state.useHouseAccount === false
                    ? (
                      <>
                        <Form.Row style={{ width: '100%' }}>
                        <Form.Group as={Col} controlId="yourName"  style={{ paddingTop: '1em',width:"100%" }}>
                          <Form.Label style={{ fontWeight: 'bold' }}>Your Name</Form.Label>
                          <Form.Control type="text" placeholder="" required name="guestName" onChange={this.handleChange} />
                        </Form.Group>
                        </Form.Row>
                        <Form.Row style={{ width: '100%' }}>
                          <Form.Group as={Col} controlId="creditCard"  style={{ paddingTop: '1em',width:"100%" }}>
                          <PaymentInputs setCard={this.setCard} />
                        </Form.Group>
                        </Form.Row>
                          <Form.Row style={{ width: '100%' }}>
                            <Form.Group as={Col} controlId="billingAddress"  style={{ paddingTop: '1em',width:"100%" }}>
                          <Form.Label style={{ fontWeight: 'bold' }}>Select a billing address</Form.Label>
                          <Select
                            defaultValue=""
                            options={this.addressList()}
                            onChange={this.handleBilling} />
                        </Form.Group>
                        </Form.Row>
                      </>
                    ) : (
                    <>
                      {this.props.loggedIn.houseAccounts.length === 1 ?
                        (
                          <Messages variantClass={"success"} alertMessage={"House Account Applied"} />
                        ):
                        (
                          <>
                        <Form.Row style={{ width: '100%' }}>
                          <Form.Group as={Col} controlId="billingAddress" style={{ paddingTop: '1em', width: '100%' }}>
                            <Form.Label style={{ fontWeight: 'bold' }}>Select an account</Form.Label>
                            <Select
                              defaultValue=""
                              options={this.accountList()}
                              onChange={this.handleHouseAccount}/>
                          </Form.Group>
                        </Form.Row>
                            </>)
                      }
                    </>
                    )
                }
                </>
              ) : (<></>)
            }
              <>
                <Form.Row style={{ width: '100%' }}>
                  <Form.Group as={Col} controlId="sendEmail"  style={{ paddingTop: '1em',width:"100%" }}>
                  <Form.Check
                    type="checkbox"
                    id="showEmail"
                    name="showEmail"
                    label="Email My Coworkers?"
                    checked={this.state.showEmail}
                    onChange={this.handleChange} />
                </Form.Group>
                </Form.Row>
              </>
              {this.state.showEmail === true
                ? (
                  <>
                  <Form.Row style={{ width: '100%' }}>
                    <Form.Group as={Col} controlId="emailAddresses"  style={{ paddingTop: '1em',width:"100%" }}>
                      <Form.Label style={{ fontWeight: 'bold' }}>Email Addresses</Form.Label>
                      <Form.Control as="textarea" placeholder={"Enter as many as you'd like, separate with commas."} name="emails" onChange={this.handleChange} rows={3}/>
                    </Form.Group>
                  </Form.Row>
                  </>
                ) : (<></>)
              }
            </Form>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          {this.state.formSubmitted ?(
            <>
              <div style={{ textAlign: 'center' }}>
              <div>Processing...</div>
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            </div>
            </>
          ):(
            <>
            <Button variant={'secondary'} data-name="groupShow" onClick={this.resetState}>Cancel</Button>
            <Button variant="brand" onClick={this.handleNewLink} >Start Group Order</Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loggedIn: state.loggedIn,
    locations: state.locations,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setLoginObject: (loggedIn) => {
      dispatch(setLoginObject(loggedIn));
    },
  };
};

OrderLink.propTypes = {
  loggedIn: PropTypes.object,
  setLoginObject: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderLink);
