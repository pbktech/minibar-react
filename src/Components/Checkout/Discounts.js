import React from 'react';
import { removeFromCart, setDeliveryDate, setLoginObject } from '../../redux/actions/actions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';


class Discounts extends React.Component {
  constructor(props, context) {
    super(props, context);
    const Config = require('../../config.json');

    this.state = {
      Config,
      API: Config.apiAddress,
    }
  }

  render() {
    if (this.props.amount === 0) {
      return (<div className="text-muted"></div>);
    }
    if (this.props.paymentHeader !== '') {
      return (<div className="text-muted"></div>);
    }
    return (
      <Form.Row>
        {this.props.discount.length
          ? (<>
              <Form.Group as={Col} md="9" controlId="promocode">
                <Form.Label style={{ fontWeight: 'bold' }}>Promo Code</Form.Label>
                {this.state.discount.map((entry, i) => {
                  return (<div key={'discount-' + i}>{entry.name + ' (' + this.props.promoCode + ') applied'} </div>);
                })}
              </Form.Group></>
          ) : (
            <>
              <Form.Group as={Col} md="6" controlId="promocode">
                <Form.Label style={{ fontWeight: 'bold' }}>Promo Code</Form.Label>
                <Form.Control type="text" placeholder="" name="promoCode" onChange={this.props.handleChange} />
              </Form.Group>
              <Form.Group as={Col} md="3" value={this.props.promoCode} controlId="button">
                <Form.Label style={{ fontWeight: 'bold' }}><br /></Form.Label>
                <Button variant="secondary" onClick={this.props.checkPrices} disabled={this.props.promoCode === ''}>
                  Apply
                </Button>
              </Form.Group></>)
        }
      </Form.Row>
    );
  }


}

const mapState = (state) => {
  return {
    cart: state.cart,
    delivery: state.delivery,
    loggedIn: state.loggedIn,
    headerID: state.headerID,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setDeliveryDate: (delivery) => {
      dispatch(setDeliveryDate(delivery));
    },
    setLoginObject: (loggedIn) => {
      dispatch(setLoginObject(loggedIn));
    },
    removeFromCart: (item) => {
      dispatch(removeFromCart(item));
    },
  };
};

Discounts.propTypes = {
  cart: PropTypes.array.isRequired,
  delivery: PropTypes.object.isRequired,
  loggedIn: PropTypes.object.isRequired,
};

export default connect(mapState, mapDispatchToProps)(Discounts);
