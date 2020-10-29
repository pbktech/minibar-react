import React from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Messages from './Messages.js';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import * as utils from './Common/utils.js';
import { Check, Key } from 'react-bootstrap-icons';
import InputGroup from 'react-bootstrap/InputGroup';

class Account extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleClose = this.handleClose.bind(this);
    this.checkHEXLink = this.checkHEXLink.bind(this);
    this.newPasswordForm = this.newPasswordForm.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.clearValidated = this.clearValidated.bind(this);
    this.setValidated = this.setValidated.bind(this);

    const Config = require('../config.json');

    this.state = {
      Config,
      API: Config.apiAddress,
      show: false,
      variantClass: '',
      alertMessage: '',
      linkHEX: '',
      password_confirm: '',
      password: '',
    };
  }

  componentDidMount() {
    if (this.props.match.params.linkHEX) {
      this.checkHEXLink();
    }
  }

  componentDidUpdate(prevProps) {

  }

  handleChange(e) {
    const name = e.target.name;
    const value = (e.target.type === 'checkbox') ? e.target.checked : e.target.value;
    const newState = {};

    newState[name] = value;
    this.setState(newState);
  }

  handleClose() {
    this.setState({ show: false });
  }

  checkHEXLink() {
    const request = {
      f: 'checklink',
      linkHEX: this.props.match.params.linkHEX,
      reason: 'forgot_password',
    };

    utils.ApiPostRequest(this.state.API + 'auth', request).then((data) => {
      if (data) {
        if (data.Variant !== 'success') {
          this.setState({
            error: data.message,
            variantClass: data.Variant,
          });
        } else {
          this.setState({
            linkHEX: this.props.match.params.linkHEX,
          });
        }
      } else {
        this.setState({
          error: 'Sorry, an unexpected error occurred',
          variantClass: 'danger',
        });
      }
    });
  }

  setValidated() {
    this.setState({ validated: true });
  }

  clearValidated() {
    this.setState({ validated: false });
  }

  changePassword(event) {
    const form = event.currentTarget;

    if (this.state.password !== this.state.password_confirm) {
      event.preventDefault();
      event.stopPropagation();
      this.setState({
        error: 'Passwords do not match',
        variantClass: 'danger',
      });
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    this.setValidated();
    if (form.checkValidity() === false) {
      return;
    }

    const request = {
      f: 'updatepass',
      linkHEX: this.state.linkHEX,
      password: this.state.password,
    };

    console.log(request);
    utils.ApiPostRequest(this.state.API + 'auth', request).then((data) => {
      if (data) {
        this.setState({
          formSubmitted: true,
          error: data.message,
          variantClass: data.Variant,
          linkHEX: '',
        });
      } else {
        this.setState({
          error: 'Sorry, an unexpected error occurred',
          variantClass: 'danger',
        });
      }
    });
  }

  newPasswordForm() {
    return (
      <Form noValidate validated={this.state.validated} onSubmit={this.changePassword}>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text id="inputGroupPrepend">
                <Key />
              </InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control type="password" name="password" onChange={this.handleChange} required />
            <Form.Control.Feedback type="invalid">
              Please provide a valid password
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
        <Form.Group controlId="password_confirm">
          <Form.Label>Password Confirmation</Form.Label>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text id="inputGroupPrepend">
                <Check />
              </InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control type="password" name="password_confirm" onChange={this.handleChange} required />
            <Form.Control.Feedback type="invalid">
              Please provide a valid password
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
        <Form.Group controlId="">
          <Button type="submit" variant="brand">Change Password</Button>
        </Form.Group>
      </Form>
    );
  }

  render() {
    return (
      <Container style={{ paddingTop: '1em' }} fluid>
        {this.state.error ? (<Messages variantClass={this.state.variantClass} alertMessage={this.state.error} />) : (<></>)}
        {this.state.linkHEX ? (
          <Container>
            <h3>Create a new password</h3>
            {this.newPasswordForm()}
          </Container>
        ) : (<h2>My Account</h2>)}
      </Container>
    );
  }
}

Account.propTypes = {
  match: PropTypes.object.isRequired,
};

export default Account;
