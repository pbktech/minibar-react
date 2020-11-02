import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Container from 'react-bootstrap/Container';
import * as utils from './Common/utils.js';
import { Key, At, PersonCircle, Telephone, Check } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { ReCaptcha } from 'react-recaptcha-v3';
import Messages from './Messages.js';
import { setLoginObject } from '../redux/actions/actions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from 'react-bootstrap/Spinner';

class Login extends React.Component {
  constructor(props, context) {
    super(props, context);
    const Config = require('../config.json');

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.setValidated = this.setValidated.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.clearValidated = this.clearValidated.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleUserNameCheck = this.handleUserNameCheck.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleShowForgot = this.handleShowForgot.bind(this);
    this.handleForgot = this.handleForgot.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.checkSession = this.checkSession.bind(this);

    this.state = {
      Config,
      API: Config.apiAddress,
      show: false,
      validated: false,
      username: '',
      password: '',
      error: '',
      variantClass: '',
      status: 0,
      emailConsent: true,
      phone: '',
      password_confirm: '',
      name: '',
      formSubmitted: false,
      showForgot: false,
    };
  }
  verifyCallback = (recaptchaToken) => {
    // Here you will get the final recaptchaToken!!!
    console.log(recaptchaToken, '<= your recaptcha token');
  }
    updateToken = () => {
      // you will get a new token in verifyCallback
      this.recaptcha.execute();
    }

    componentDidMount() {
    }

    checkSession() {
      const request = { f: 'logout', sessionID: this.props.loggedIn.sessionID };

      utils.ApiPostRequest(this.state.API + 'auth', request).then((data) => {
        if (data) {
          if (data.Variant !== 'success') {
            this.props.setLoginObject({
              guestName: '',
              sessionID: '',
              guestCredits: [],
            });
          }
        } else {
          this.setState({
            error: "I'm sorry, an unexpected error occurred.",
            variantClass: 'danger',
          });
        }
      });
    }

    handleClose() {
      this.setState({
        show: false,
        error: '',
        variantClass: '',
        validated: false,
        showForgot: false,
      });
    }

    handleChange(e) {
      const name = e.target.name;
      const value = (e.target.type === 'checkbox') ? e.target.checked : e.target.value;

      const newState = {};

      newState[name] = value;
      this.setState(newState);
    }
    handleLogin(event) {
      const form = event.currentTarget;

      event.preventDefault();
      event.stopPropagation();

      this.setValidated();
      if (form.checkValidity() === false) {
        return;
      }

      const request = { f: 'login', user: this.state.username, password: this.state.password };


      this.setState({ formSubmitted: true });
      utils.ApiPostRequest(this.state.API + 'auth', request).then((data) => {
        if (data) {
          if (data.Variant === 'success') {
            this.props.setLoginObject({
              guestName: data.guestName,
              phone: data.phone,
              email: data.email,
              sessionID: data.sessionID,
              addresses: data.addresses,
              orders: data.orders,
              groupOrders: data.groupOrders,
              groupLinks: data.grouplinks,
            });
            this.handleClose();
          } else {
            this.setState({
              formSubmitted: false,
              error: data.message,
              variantClass: data.Variant,
            });
          }
        } else {
          this.setState({
            error: "I'm sorry, an unexpected error occurred.",
            variantClass: 'danger',
          });
        }
      });
    }

    handleLogout() {
      const request = { f: 'logout', sessionID: this.props.loggedIn.sessionID };

      utils.ApiPostRequest(this.state.API + 'auth', request).then((data) => {
        if (data) {
          if (data.Variant === 'success') {
            this.props.setLoginObject({
              guestName: '',
              sessionID: '',
              guestCredits: [],
              error: data.message,
              phone: '',
              email: '',
              addresses: [],
            });
            this.handleClose();
          } else {
            this.setState({
              formSubmitted: false,
              error: data.message,
              variantClass: data.Variant,
            });
          }
        } else {
          this.setState({
            error: "I'm sorry, an unexpected error occurred.",
            variantClass: 'danger',
          });
        }
      });
    }

    handleUserNameCheck() {

    }
    clearValidated() {
      this.setState({ validated: false });
    }

    setValidated() {
      this.setState({ validated: true });
    }

    handleShow() {
      this.setState({ show: true });
    }
    handleShowForgot() {
      this.setState({
        showForgot: true,
      });
    }

    handleForgot(event) {
      const form = event.currentTarget;

      event.preventDefault();
      event.stopPropagation();

      this.setValidated();

      if (form.checkValidity() === false) {
        return;
      }

      const request = {
        f: 'forgotpass',
        user: this.state.username,
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
    }

    handleSubmit(event) {
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
        f: 'register',
        name: this.state.name,
        user: this.state.username,
        phone: this.state.phone,
        password: this.state.password,
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
    }

    render() {
      return (
        <>
          {this.props.loggedIn.sessionID ? (
            <>
              <li>
                <Link to="/account" className="site-nav-link" style={{ color: '#F36C21' }} data-toggle="tooltip" data-placement="bottom" title="View your account" >My Account</Link>
              </li>
              <li>
                <Button variant="link" className="site-nav-link" onClick={this.handleLogout}>Logout</Button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="#" onClick={this.handleShow} className="site-nav-link">
                  Register/Login
                </Link>
              </li>
              <Modal show={this.state.show} onHide={this.handleClose} size="lg">
                <Modal.Header closeButton>
                  <Modal.Title as="h2">Login or Register</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {this.state.error ? (<Messages variantClass={this.state.variantClass} alertMessage={this.state.error} />) : (<></>)}
                  {this.state.showForgot
                    ? (this.state.variantClass === 'success' ? (<></>) : (
                      !this.state.formSubmitted ? (
                        <Container>
                          <Form noValidate validated={this.state.validated} onSubmit={this.handleForgot}>
                            <Form.Group controlId="email">
                              <Form.Label>Username</Form.Label>
                              <InputGroup>
                                <InputGroup.Prepend>
                                  <InputGroup.Text id="inputGroupPrepend">
                                    <At />
                                  </InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control required type="email" name="username" onChange={this.handleChange} />
                                <Form.Control.Feedback type="invalid">
                                  Your email is required.
                                </Form.Control.Feedback>
                              </InputGroup>
                            </Form.Group>
                            <Form.Group controlId="">
                              <Button type="submit" variant="brand">Reset</Button>
                            </Form.Group>
                          </Form>
                        </Container>
                      ) : (
                        <div style={{ textAlign: 'center' }}>
                          <div>Updating...</div>
                          <Spinner animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                          </Spinner>
                        </div>
                      )

                    )) : (
                      this.state.variantClass === 'success' ? (<></>) : (
                        <Tabs defaultActiveKey="login" id="uncontrolled-tab-example">
                          <Tab eventKey="login" title="Login" onChange={this.clearValidated}>
                            <Container>
                              <Form noValidate validated={this.state.validated} onSubmit={this.handleLogin}>
                                <Form.Group controlId="email">
                                  <Form.Label>Username</Form.Label>
                                  <InputGroup>
                                    <InputGroup.Prepend>
                                      <InputGroup.Text id="inputGroupPrepend">
                                        <At />
                                      </InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control required type="email" name="username" onChange={this.handleChange} />
                                    <Form.Control.Feedback type="invalid">
                                      Your email is required.
                                    </Form.Control.Feedback>
                                  </InputGroup>
                                </Form.Group>
                                <Form.Group controlId="name">
                                  <Form.Label>Password</Form.Label>
                                  <InputGroup>
                                    <InputGroup.Prepend>
                                      <InputGroup.Text id="inputGroupPrepend">
                                        <Key />
                                      </InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control required type="password" name="password" onChange={this.handleChange} />
                                    <Form.Control.Feedback type="invalid">
                                      Please provide a valid password
                                    </Form.Control.Feedback>
                                  </InputGroup>
                                </Form.Group>
                                <Form.Group controlId="forgotpassword">
                                  <Link to="#" onClick={this.handleShowForgot} className="site-nav-link" >Forgot Password?</Link>
                                </Form.Group>
                                <Form.Group controlId="">
                                  <Button type="submit" variant="brand">Login</Button>
                                </Form.Group>
                              </Form>
                            </Container>
                          </Tab>
                          <Tab eventKey="register" title="Register" onChange={this.clearValidated}>
                            <Container>
                              <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmit}>
                                <Form.Group controlId="name">
                                  <Form.Label>Your Name</Form.Label>
                                  <InputGroup>
                                    <InputGroup.Prepend>
                                      <InputGroup.Text id="inputGroupname">
                                        <PersonCircle />
                                      </InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control required type="name" name="name" onChange={this.handleChange} />
                                    <Form.Control.Feedback type="invalid">
                                      Your name is required.
                                    </Form.Control.Feedback>
                                  </InputGroup>
                                </Form.Group>
                                <Form.Group controlId="phone">
                                  <Form.Label>Phone Number</Form.Label>
                                  <InputGroup>
                                    <InputGroup.Prepend>
                                      <InputGroup.Text id="inputGroupPrepend">
                                        <Telephone />
                                      </InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control required type="phone" name="phone" onChange={this.handleChange} />
                                    <Form.Control.Feedback type="invalid">
                                      Your phone number is required.
                                    </Form.Control.Feedback>
                                  </InputGroup>
                                </Form.Group>
                                <Form.Group controlId="email">
                                  <Form.Label>Email Address</Form.Label>
                                  <InputGroup>
                                    <InputGroup.Prepend>
                                      <InputGroup.Text id="inputGroupPrepend">
                                        <At />
                                      </InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control required type="email" name="username" onChange={this.handleChange} />
                                    <Form.Control.Feedback type="invalid">
                                      Your email is required.
                                    </Form.Control.Feedback>
                                  </InputGroup>
                                  <div id="emailHelp" className="form-text text-muted">
                                    We'll never share your email with anyone else.
                                  </div>
                                </Form.Group>
                                <Form.Group controlId="password">
                                  <Form.Label>Password</Form.Label>
                                  <InputGroup>
                                    <InputGroup.Prepend>
                                      <InputGroup.Text id="inputGroupPrepend">
                                        <Key />
                                      </InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control required type="password" name="password" onChange={this.handleChange} />
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
                                    <Form.Control required type="password" name="password_confirm" onChange={this.handleChange} />
                                    <Form.Control.Feedback type="invalid">
                                      Please provide a valid password
                                    </Form.Control.Feedback>
                                  </InputGroup>
                                </Form.Group>
                                <Form.Group>
                                  <Form.Check name="emailConsent" label="I consent to receive marketing emails from Protein Bar & Kitchen" checked={this.state.emailConsent} onChange={this.handleChange} />
                                  <div id="emailHelp" className="form-text text-muted">
                                    We'll never share your email with anyone else.<br />
                                    <small><a href="https://www.theproteinbar.com/privacy-policy/" target="_blank" rel="noopener noreferrer" >Protein Bar & Kitchen Privacy Policy</a></small>
                                  </div>
                                </Form.Group>
                                <Form.Group controlId="">
                                  <ReCaptcha
                                    ref={ref => this.recaptcha = ref}
                                    sitekey="6Leg9tIZAAAAAObuwfCE_VOLz5zqte7Jft2Kf5wB"
                                    action="action_name"
                                    verifyCallback={this.verifyCallback} />
                                  <Button type="submit" variant="brand">Register</Button>
                                </Form.Group>
                              </Form>
                            </Container>
                          </Tab>
                        </Tabs>
                      )
                    )}
                </Modal.Body>
              </Modal>
            </>
          )}
        </>
      );
    }
}

const mapStateToProps = (state) => {
  return { loggedIn: state.loggedIn };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setLoginObject: (loggedIn) => {
      dispatch(setLoginObject(loggedIn));
    },
  };
};

Login.propTypes = {
  loggedIn: PropTypes.object,
  setLoginObject: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
