import React from 'react';
import { removeFromCart } from '../redux/actions/actions';
import { connect } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { Trash, Pencil } from 'react-bootstrap-icons';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import DeliveryDateSelector from './DeliveryDateSelector';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

class Cart extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.setValidated = this.setValidated.bind(this);
    this.renderTooltip = this.renderTooltip.bind(this);

    this.state = {
      show: false,
      validated: false,
    };
  }

  renderTooltip = (message) => (
    <Tooltip id="button-tooltip" >
      {message}
    </Tooltip>
  );

  setValidated() {
    this.setState({ validated: true });
  }

  handleClose() {
    this.setState({ show: false });
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
      <div style={{ fontFamily: 'Lora' }}>
        {this.props.delivery && this.props.delivery.service !== '' ? (
          <>
            {this.props.delivery.service + ' delivery on ' + this.props.delivery.date + ' '}
            <br />Order by <strong>{this.props.delivery.cutOffTime}</strong> for delivery at <strong>{this.props.delivery.deliveryTime}</strong>
            {this.props.delivery.headerGUID === '' ? (
              <>
                <OverlayTrigger
                  placement="bottom"
                  delay={{ show: 250, hide: 400 }}
                  overlay={this.renderTooltip("Change you date/time or service")}
                >
                <Button variant="link" onClick={this.handleShow} style={{ color: '#000000' }}>
                  <Pencil size={18} />
                </Button>
                </OverlayTrigger>
                <DeliveryDateSelector show={this.state.show} handleClose={this.handleClose} services={this.props.services} name={this.props.name} guid={this.props.guid} link={this.props.link} />
              </>) : (<></>)
            }
          </>) : (<></>)}
        {this.props.delivery.maximumCheck && this.props.delivery.maximumCheck > 0 ? (
          <>
            <div className={'text-muted'}><br />You have a check maximum of ${this.props.delivery.maximumCheck} with tax.</div>
          </>
        ) : (<></>)}
        <hr />
        {this.props.cart.length > 0 ? (
          <>
            <Row>
              <Col>
                <div style={{ overflowY: 'auto', overflowX: 'hidden', height: '70vh' }}>
                  {this.props && this.props.cart.map((item, i) => {
                    subTotal = subTotal + item.quantity * parseFloat(item.price);
                    return (
                      <Row key={'cartItem_' + i}>
                        <Col className="col-sm-9" key={i}>
                          {item.quantity} <strong>{item.name}</strong>
                          {item.forName !== '' ? (<div className="text-muted">{item.forName}</div>) : (<></>)
                          }
                          <ul style={{ listStyleType: 'none' }}>
                            {item.mods && item.mods.map((mod) => {
                              subTotal = subTotal + item.quantity * parseFloat(mod.price);
                              return <li>{mod.modifier}</li>;
                            })}
                            {
                              item.specialRequest && item.specialRequest !== '' ? (
                                <li>Special Request: - <b>{item.specialRequest}</b></li>
                              ) : (<></>)
                            }
                          </ul>
                        </Col>
                        <Col className="col-sm-3">
                          <Button
                            data-index={i} variant="outline-danger" onClick={(event) => {
                              this.props.removeFromCart(parseInt(event.target.dataset.index, 10));
                            }}>
                            <Trash data-index={i} size={18} />
                          </Button>
                        </Col>
                      </Row>
                    );
                  })}
                </div>
              </Col>
            </Row>
            <Row style={{ position: 'fixed', bottom: '10px', backgroundColor: '#fff' }}>
              <hr />
              <Col className="col-sm-9">Subtotal: ${subTotal.toFixed(2)}</Col>
              <Col className="col-sm-3">
                <Link to="/checkout">
                  <Button variant="brand">Checkout</Button>
                </Link>
              </Col>
            </Row>
          </>
        ) : (
          <Row><Col>
            <div style={{ color: '#dee2e6' }}>Your cart is empty</div>
          </Col></Row>
        )}
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    cart: state.cart,
    delivery: state.delivery,
    locations: state.locations,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    removeFromCart: (item) => {
      dispatch(removeFromCart(item));
    },
  };
};

Cart.propTypes = {
  delivery: PropTypes.object,
  cart: PropTypes.array,
  removeFromCart: PropTypes.func.isRequired,
};

export default connect(mapState, mapDispatchToProps)(Cart);
