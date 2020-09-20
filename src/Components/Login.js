import React from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import ReactPasswordStrength from 'react-password-strength/dist/universal'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'

class Login extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
      show: false,

    }
  }
  handleClose() {
    this.setState({show: false});
  }

  handleShow() {
    this.setState({show: true});
  }

  render() {
      return(
        <>
          <a href="#" onClick={this.handleShow} className="site-nav-link">Register/Login</a>
          <Modal show={this.state.show} onHide={this.handleClose} size="lg">
            <Modal.Header closeButton>
              <Modal.Title as="h2">Login or Register</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Tabs defaultActiveKey="login" id="uncontrolled-tab-example">
                <Tab eventKey="login" title="Login">
                  <input placeholder="E-Mail" type="text" className="form-control"/><br/>
                  <input placeholder="Password" type="password" className="form-control"/>
                </Tab>
                <Tab eventKey="register" title="Register">
                  <input placeholder="Name" type="text" className="form-control"/><br/>
                  <input placeholder="Phone Number" type="text" className="form-control"/><br/>
                  <input placeholder="E-Mail" type="text" className="form-control"/><br/>
                  <ReactPasswordStrength
                    className="form-control"
                    style={{ display: 'none' }}
                    minLength={5}
                    minScore={2}
                    scoreWords={['weak', 'okay', 'good', 'strong', 'stronger']}
                    inputProps={{ name: "password_input", autoComplete: "off", className: "form-control" }}
                  />
                </Tab>
              </Tabs>
            </Modal.Body>
          </Modal>
        </>
      )

  }
}

export default Login;
