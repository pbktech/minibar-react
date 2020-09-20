import React from 'react';
import {addToCart, removeFromCart} from "../redux/actions/actions";
import {connect} from "react-redux";
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { Cart4, Trash } from 'react-bootstrap-icons';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Login from './Login.js'

class Cart extends React.Component {
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
    let subTotal = 0.00;
    return (
      <div>
      <div className="site-nav" style={{float:"right"}}>
        <ul className="site-nav-menu" style={{display:"inline"}}>
          <li style={{display:"inline"}}><Login /></li>
          <li style={{display:"inline"}}><a href="#" onClick={this.handleShow}> <Cart4 style={{color:"#92ad27"}}/> ({this.props.cart.length})</a></li>
        </ul>
      </div>
      <Modal show={this.state.show} onHide={this.handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title as="h2">Your Current Order</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      {
        this.props && this.props.cart.map((item, i) => {
          console.log(item);
          subTotal += item.quantity * parseFloat(item.price);
          return <Row>
          <Col className="col-sm-10" key={i}>{item.quantity} <strong>{item.name}</strong><ul style={{listStyleType:"none"}}>
          {
            item.mods.map((mod) => {
              subTotal+=item.quantity * parseFloat(mod.price);
              return <li>{mod.modifier}</li>
            })
          }
          </ul>
          </Col>
          <Col className="col-sm-2">
            <Button data-index={i} variant="outline-danger" onClick={(event) => {this.props.dispatch(removeFromCart(event.target.dataset.index));}}><Trash /></Button>
          </Col>
          </Row>
        })
      }
      </Modal.Body>
      <Modal.Footer>
        Subtotal: ${subTotal}
        <Button variant="secondary" onClick={this.handleClose}>
          Add More Items
        </Button>
        <Button variant="primary" href="/checkout">
          Checkout
        </Button>
      </Modal.Footer>
      </Modal>
    </div>);
  }
}

const mapState = (state) => {
  return {
    cart: state.cart,
  };
}

export default connect(mapState, null)(Cart);
