import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ReactPasswordStrength from 'react-password-strength/dist/universal';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Container from 'react-bootstrap/Container';

class Login extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.setValidated = this.setValidated.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.clearValidated = this.clearValidated.bind(this);
    this.state = {
      show: false,
      validated: false,
    };
  }

  handleClose() {
    this.setState({ show: false });
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
                  <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmit}>
                    <Form.Group controlId="email">
                      <Form.Label>Username</Form.Label>
                      <InputGroup>
                        <InputGroup.Prepend>
                          <InputGroup.Text id="inputGroupPrepend">
                            @
                          </InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control required type="email" name="email" />
                        <Form.Control.Feedback type="invalid">
                          Your email is required.
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                    <Form.Group controlId="name">
                      <Form.Label>Password</Form.Label>
                      <Form.Control required type="password" name="password" />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid password
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="">
                      <Button type="submit">Login</Button>
                    </Form.Group>
                  </Form>
                </Container>
              </Tab>
              <Tab eventKey="register" title="Register" onChange={this.clearValidated}>
                <Container>
                  <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmit}>
                    <Form.Group controlId="name">
                      <Form.Label>Your Name</Form.Label>
                      <Form.Control required type="name" name="name" />
                      <Form.Control.Feedback type="invalid">
                        Your name is required.
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="phone">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control required type="phone" name="phone" />
                      <Form.Control.Feedback type="invalid">
                        Your phone number is required.
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="email">
                      <Form.Label>Email Address</Form.Label>
                      <InputGroup>
                        <InputGroup.Prepend>
                          <InputGroup.Text id="inputGroupPrepend">
                            @
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
                    <Form.Group controlId="name">
                      <Form.Label>Password</Form.Label>
                      <Form.Control required type="password" name="password" />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid password
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="">
                      <Button type="submit">Register</Button>
                    </Form.Group>
                  </Form>
                </Container>
              </Tab>
            </Tabs>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default Login;
