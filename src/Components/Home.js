
import React from 'react';
// eslint-disable-next-line
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      API: props.API,
      error: "",
      show: false,
    }
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  handleClose() {
    this.setState({show: false});
  }

  handleShow() {
    this.setState({show: true});
  }

  componentDidUpdate(prevProps) {
    if (prevProps.locations.length !== this.props.locations.length) {
      this.setState({
        locations: this.props.locations
      });
    }
  }

  setError(e) {
    this.setState({
      error: e
    });
  }

  render() {
    if (this.state.error) {
      return <div className="error">{this.state.error}</div>;
    }
      return (
        <Container style={{textAlign:"center"}} fluid>
          <Row style={{background:"url(/assets/images/3094Teddy-Desk_navy.jpg)",paddingBottom:"2em",color:"#0E2244"}}>
            <Col>
              <h3><img src="/assets/images/MiniBarLogo_bluewhite.png" alt="PBK Minibar" data-alt_text="" className="fr-fic fr-dib" style={{width: "879px"}} /></h3>
              <h2>STOCK UP FOR LUNCH WITHOUT LEAVING THE OFFICE</h2>
              <div style={{fontWeight:"bold",fontSize: "18px",color:"#0E2244"}}>
              Get free delivery from PBK to your office,<br/>through rain, snow, sleet, hail or never-ending conference calls.<br/>We'll even let you know when it's arrived.<br/><br/>Work's hard, getting your lunch doesn't have to be.&nbsp;
              </div>
            </Col>
          </Row>
          <Row >
            <Col><br/><br/><br/>
              <div className="container" >
                <div style={{color:"#000000",backgroundColor:"#FFFFFF"}}>
                  <h3>HOW IT WORKS</h3>
                  <ul>
                    <li>Free delivery, right to your office</li>
                    <li>Easy online ordering from our full menu</li>
                    <li>Make it your own - customize your lunch for any dietary lifestyle</li>
                    <li>Delivery by lunch time</li>
                    <li>We'll send an email when your lunch arrives - no need to hover in the kitchen</li>
                  </ul>
                </div>
                <Button className="btn btn-brand" onClick={this.handleShow}>Request a Minibar</Button>
              </div>
              <Modal show={this.state.show} onHide={this.handleClose} size="lg">
              <Modal.Header closeButton>
                <Modal.Title as="h2">Protein Bar & Kitchen - MiniBar Request</Modal.Title>
              </Modal.Header>
              <Modal.Body>
              <div>Interested in having Protein Bar & Kitchen delivered to your office for free?  Let us know more about you and we'll be in touch shortly!</div><br/><br/>
              <Form>
                <Form.Group controlId="email">
                  <Form.Label>Email address</Form.Label><Form.Control type="email" placeholder="" />
                </Form.Group>
                <Form.Group controlId="name">
                  <Form.Label>Your Name</Form.Label><Form.Control type="text" placeholder="" />
                </Form.Group>
                <Form.Group controlId="phone">
                  <Form.Label>Contact Phone Number</Form.Label><Form.Control type="text" placeholder="" />
                </Form.Group>
                <Form.Group controlId="company">
                  <Form.Label>Proposed MiniBar Location (e.g., Company Name)</Form.Label><Form.Control type="text" placeholder="" />
                </Form.Group>
                <Form.Group controlId="address">
                  <Form.Label>Location Address</Form.Label><Form.Control type="text" placeholder="" as="textarea" />
                </Form.Group>
                  <Form.Group controlId="size">
                   <Form.Label>Approximate Number of People at your Location</Form.Label>
                   <Form.Control as="select">
                    <option value="100">&lt; 100 People</option>
                    <option value="100-250">100-250 People</option>
                    <option value="250-500">250-500 People</option>
                    <option value="500">&gt; 500 People</option>
                  </Form.Control>
                </Form.Group>
              </Form>
              </Modal.Body>
              <Modal.Footer>
              <Button variant="secondary" onClick={this.handleClose}>
                Close
              </Button>
              <Button variant="primary">
                Send Request!
              </Button>
              </Modal.Footer>
              </Modal>
            </Col>
          </Row>
          <Row >
            <Col><br/><br/><br/>
              <h3>Ready to order?</h3>
              <br/>
              <Button className="btn btn-brand" href="/order">Start an Order</Button>
              </Col>
            </Row>
        </Container>
      );
  }
}

export default Home;
