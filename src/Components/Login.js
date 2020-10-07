import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ReactPasswordStrength from 'react-password-strength/dist/universal';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Container from 'react-bootstrap/Container';
import * as utils from '../utils.js';
import { Key,At,PersonCircle,Telephone,Check } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { ReCaptcha } from 'react-recaptcha-v3'

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

    this.state = {
      show: false,
      validated: false,
      username: "",
      password: "",
      loggedIn: false,
      guestName:"",
      status:0,
      
    };
  }
  verifyCallback = (recaptchaToken) => {
      // Here you will get the final recaptchaToken!!!
      console.log(recaptchaToken, "<= your recaptcha token")
    }
    updateToken = () => {
        // you will get a new token in verifyCallback
        this.recaptcha.execute();
      }
  handleClose() {
    this.setState({ show: false });
  }

  handleChange(e){
    const name = e.target.name;
    const value = e.target.value;

    let newState = {};
    newState[name] = value;
    this.setState(newState);
  }
  handleLogin(event) {
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.setValidated();

    let request = {f:"login", user:this.state.username, password:this.state.password}

    utils.ApiPostRequest(this.state.API + "/auth",request).then((data) => {
      if (data.answer) {
        this.setState({
          status: data.status,
        });
      } else {
        this.setState({
          message: '<div className="error">Sorry, an unexpected error occurred</div>',
        });
      }
    })
  }
  handleUserNameCheck(){

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

  handleSubmit(event) {
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.setValidated();
  }

  render() {
    return (
      <>
      {this.state.loggedIn ? (
        <span className="site-nav-link">Welcome {this.state.guestName}</span>
      ):(
        <>
        <a href="#" onClick={this.handleShow} className="site-nav-link">
          Register/Login
        </a>
        <Modal show={this.state.show} onHide={this.handleClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title as="h2">Login or Register</Modal.Title>
          </Modal.Header>
          <Modal.Body>
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
                      <Link to="/forgotpassword">Forgot Password?</Link>
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
                      <Form.Control required type="name" name="name" onBlur={this.handleUserNameCheck} />
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
                      <Form.Control required type="phone" name="phone" />
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
                        <Form.Control required type="email" name="email" />
                        <Form.Control.Feedback type="invalid">
                          Your email is required.
                        </Form.Control.Feedback>
                      </InputGroup>
                      <small id="emailHelp" className="form-text text-muted">
                        We'll never share your email with anyone else.
                      </small>
                    </Form.Group>
                    <Form.Group controlId="password">
                      <Form.Label>Password</Form.Label>
                      <InputGroup>
                        <InputGroup.Prepend>
                          <InputGroup.Text id="inputGroupPrepend">
                            <Key />
                          </InputGroup.Text>
                        </InputGroup.Prepend>
                      <Form.Control required type="password" name="password" />
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
                      <Form.Control required type="password" name="password_confirm" />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid password
                      </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                    <Form.Group controlId="">
                    <ReCaptcha
                                ref={ref => this.recaptcha = ref}
                                sitekey="6Leg9tIZAAAAAObuwfCE_VOLz5zqte7Jft2Kf5wB"
                                action='action_name'
                                verifyCallback={this.verifyCallback}
                            />
                      <Button type="submit" variant="brand">Register</Button>
                    </Form.Group>
                  </Form>
                </Container>
              </Tab>
            </Tabs>
          </Modal.Body>
        </Modal>
        </>
        )}
      </>
    );
  }
}

export default Login;
