import React from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Messages from '../Messages.js';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import * as utils from '../Common/utils.js';
import { Key, At, PersonCircle, Telephone, Check, Trash, Pencil, X, Receipt, Printer } from 'react-bootstrap-icons';
import InputGroup from 'react-bootstrap/InputGroup';
import Select from 'react-select';
import chroma from 'chroma-js';
import { setLoginObject } from '../../redux/actions/actions';
import { connect } from 'react-redux';
import Row from 'react-bootstrap/Row';
import PaymentInputs from '../Common/PaymentInputs.js';
import FormControl from 'react-bootstrap/FormControl'

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

    this.state = {
      Config,
      API: Config.apiAddress,
      validated: false,
      message: '',
      miniBar: '',
      payer: false,
      maxOrder: 0,
      formSubmitted: false,
      paymentType: 'card',
      houseAccount: 'fds',
      useHouseAccount: false,
      card: {
        isValid: false,
        type: '',
        cvc: '',
        cardNumber: '',
        expiryDate: '',
     },
    }
  }

  clearValidated() {
    this.setState({ validated: false });
  }

  setValidated() {
    this.setState({ validated: true });
  }

  handleSelect(e){
    this.setState({
      miniBar: e.value,
    })
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
        number = card.target.value.replaceAll(" ","");
        break;
      case 'cvc':
        cvc = card.target.value;
        break;
      default:
    }

    if(card.target.name === 'cardNumber' && this.luhn_validate(number)){
      isValid = true;
    }else {
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
    console.log(e.target);
    console.log(e.target.checked)
    const name = e.target.name;
    const value = (e.target.type === 'checkbox') ? e.target.checked : e.target.value;
    const newState = {};

    newState[name] = value;
    this.setState(newState);
  }

  handleNewLink(event){
    console.log(this.state.miniBar)
    if (event.checkValidity() === false) {
      return;
    }

    /*
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

    utils.ApiPostRequest(this.state.API + 'auth', request).then((data) => {
      if (data) {
        this.setState({
          formSubmitted: true,
          error: data.message,
          variantClass: data.Variant,
        });
      } else {
        this.setState({
          message: '<div className="error">Sorry, an unexpected error occurred</div>',
        });
      }
    });
  */
  }

  selectData(){
    const optionGroups = [];

    this.props.locations && this.props.locations.map((entry, i) => {
      const options = [];
      entry.services.map((service, ia) => {
        service.orderDates.length && service.orderDates.map((orderDate, ib) => {
          const parseOrderDate = orderDate.split(' - ');
          let actualOrderDate = '';
          if (parseOrderDate[1]) {
            actualOrderDate = parseOrderDate[1];
          } else {
            actualOrderDate = orderDate;
          }
          options.push({value:service.name + '-' + actualOrderDate + '-' + service.cutOffTime + '-' + service.deliveryTime + '-' + ib, label: actualOrderDate, color:utils.pbkStyle.orange });
        });
        optionGroups.push({value:'', label: 'Minibar @ ' + entry.name + '\n' + service.name + ' order by ' + service.cutOffTime + ' to be delivered at ' + service.deliveryTime, color:utils.pbkStyle.orange, options:options });
      });
    });
    return optionGroups;
  }


  render(){

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
              ? chroma.contrast(chroma("#ccc"), 'white') > 2
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
      input: styles => ({ ...styles, }),
      placeholder: styles => ({ ...styles,  }),
      singleValue: (styles, { data }) => ({ ...styles,  }),
    };
    return (
      <Modal show={this.props.show} onHide={this.props.handleClose} size={"lg"}>
        <Modal.Header><Modal.Title as="h2">Create a group order</Modal.Title></Modal.Header>
        <Modal.Body>
        <Container style={{fontFamily: "Lora"}}>
          <Form validated={this.state.validated} >
            <Form.Group controlId="dateSelect" as={"Row"} style={{padding: '1em'}}>
              <Form.Label style={{fontWeight :"bold"}}>Select a delivery location, day and time</Form.Label>
              <Select
                defaultValue=""
                value={this.state.miniBar}
                options={this.selectData()}
                styles={colourStyles}
                onChange={this.handleSelect}
              />
              </Form.Group>
            <Form.Group as={"Row"} style={{padding: '1em'}}>
              <Form.Check
                type="switch"
                id="payer"
                name="payer"
                label="I will pay for this group order"
                value="group"
                onChange={this.handleChange}
              />
            </Form.Group>
            {this.state.payer === true ? (
              <>
                <Form.Label style={{fontWeight :"bold"}}>Max individual order amount</Form.Label>
                <div className="text-muted">Leave empty for no max.</div>
                  <InputGroup className="sm-2">
                    <InputGroup.Prepend>
                      <InputGroup.Text>$</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl aria-label="Amount (to the nearest dollar)" style={{width:"200px"}} />
                    <InputGroup.Append>
                      <InputGroup.Text>.00</InputGroup.Text>
                    </InputGroup.Append>
                  </InputGroup>
                {this.state.houseAccount !== '' ? (
                  <>
                    <Form.Group as={"Row"} style={{padding: '1em'}}>
                      <Form.Check
                        type="switch"
                        id="useHouseAccount"
                        name="useHouseAccount"
                        label="Use House Account?"
                        onChange={this.handleChange}
                      />
                    </Form.Group>
                  </>
                ):(<></>)

                }
                {this.state.useHouseAccount === false ?
                  (
                  <Form.Group as={"Row"} style={{padding: '1em'}}>
                    <PaymentInputs setCard={this.setCard}/>
                  </Form.Group>
                  ):(<></>)
                }
              </>
            ):(<></>)
            }
            <Form.Group controlId="exampleForm.ControlTextarea1" as={"Row"} style={{padding: '1em'}}>
              <Form.Label style={{fontWeight :"bold"}}>Email Addresses</Form.Label>
              <div className="text-muted">Enter as many as you'd like, separate with commas.</div>
              <Form.Control as="textarea" rows={3} />
            </Form.Group>
          </Form>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant={'secondary'} data-name="groupShow" onClick={this.props.handleClose}>Cancel</Button>
          <Button variant="brand" onClick={this.handleNewLink} >Start Group Order</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

const mapStateToProps = (state) => {
  return { loggedIn: state.loggedIn };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setLoginObject: (loggedIn) => {
      dispatch(setLoginObject(loggedIn));
    }
  };
};

OrderLink.propTypes = {
  loggedIn: PropTypes.object,
  setLoginObject: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderLink);
