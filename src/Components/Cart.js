import React from 'react';
import {addToCart, removeFromCart} from '../redux/actions/actions';
import { connect } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { Cart4, Trash } from 'react-bootstrap-icons';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class Cart extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.setValidated = this.setValidated.bind(this);
    this.state = {
      show: false,
      validated: false,
    };
  }

  handleClose() {
    this.setState({ show: false });
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
    let subTotal = 0.0;
    return (
      <Container>
        {this.props.delivery && 'Delivery on ' + this.props.delivery.date}
        {this.props &&
          this.props.cart.map((item, i) => {
            subTotal += item.quantity * parseFloat(item.price);
            return (
              <Row>
                <Col className="col-sm-9" key={i}>
                  {item.quantity} <strong>{item.name}</strong>
                  <ul style={{ listStyleType: 'none' }}>
                    {item.mods.map((mod) => {
                      subTotal += item.quantity * parseFloat(mod.price);
                      return <li>{mod.modifier}</li>;
                    })}
                  </ul>
                </Col>
                <Col className="col-sm-3">
                  <Button data-index={i} variant="outline-danger" onClick={(event) => {
                    this.props.dispatch(
                      removeFromCart(parseInt(event.target.dataset.index, 10))
                    );
                  }}>
                    <Trash data-index={i} />
                  </Button>
                </Col>
              </Row>
            );
          })}
        {this.props.cart.length > 0 ? (
          <Row>
            <Col>Subtotal: ${subTotal}</Col>
            <Col>
              <Link to="/checkout">
                <Button>Checkout</Button>
              </Link>
            </Col>
          </Row>
        ) : (
          <div style={{ color: '#dee2e6' }}>Your cart is empty</div>
        )}
      </Container>
    );
  }
}

const mapState = (state) => {
  return {
    cart: state.cart,
    delivery: state.delivery,
  };
};

Cart.propTypes = {
  dispatch: PropTypes.func.isRequired,
  delivery: PropTypes.object,
  cart: PropTypes.array
};

export default connect(mapState, null)(Cart);
