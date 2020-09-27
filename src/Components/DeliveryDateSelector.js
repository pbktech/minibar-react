import React from 'react';
import { setDeliveryDate } from '../redux/actions/actions';
import { connect } from 'react-redux';
import { Modal, Button, Form } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { encodeFormData } from '../utils';
import PropTypes from 'prop-types';

class DeliveryDateSelector extends React.Component {
  constructor(props) {
    super(props);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.setRedirect = this.setRedirect.bind(this);
    this.state = {
      show: false,
      deliveryDate: '',
      service: '',
      toOrder: false,
    };
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  setRedirect() {
    this.setState({ toOrder: true });
  }

  handleChange(e) {
    if (e.target.name === 'deliveryDate') {
      let res = e.target.value.split('-');
      const cookies = new Cookies();

      this.setState(
        {
          service: res[0],
          deliveryDate: res[1],
        },
        () => {
          cookies.set(
            'delivery',
            encodeFormData({
              location: this.props.name,
              guid: this.props.guid,
              date: this.state.deliveryDate,
              service: this.state.service,
            }),
            { path: '/' }
          );

          this.props.dispatch(
            setDeliveryDate({
              location: this.props.name,
              guid: this.props.guid,
              date: this.state.deliveryDate,
              service: this.state.service,
            })
          );
        }
      );
    }
  }

  render() {
    if (this.state.toOrder) {
      return (
        <Redirect
          from="/"
          to={'/order/' + this.props.link + '/' + this.state.service}
        />
      );
    }
    return (
      <div>
        <Button className="btn btn-brand" onClick={this.handleShow}>
          Order Here
        </Button>
        <Modal show={this.state.show} onHide={this.handleClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title as="h2">When do you want this delivered?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {this.props.services.map((entry, i) => {
                return (
                  <div key={'service' + i}>
                    <h3 key={'servicename' + i}>{entry.name}</h3>
                    {entry.orderDates.length &&
                      entry.orderDates.map((orderDate, ia) => {
                        return (
                          <div key={'option' + ia} className="mb-3">
                            <Form.Check onChange={this.handleChange} type="radio" name="deliveryDate" id={`deliveryDate-${ia}`} label={orderDate} value={entry.name + '-' + orderDate} checked={orderDate === this.state.deliveryDate}/>
                          </div>
                        );
                      })}
                  </div>
                );
              })}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                this.props.dispatch(
                  setDeliveryDate({
                    location: this.props.name,
                    guid: this.props.guid,
                    date: this.state.deliveryDate,
                    service: this.state.service,
                  })
                );
                this.handleClose();
                //push("/order/" + this.props.link + "/" + this.state.service)
                //window.location.href="/order/" + this.props.link + "/" + this.state.service
                this.setRedirect();
              }}>
              Start Order
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

DeliveryDateSelector.propTypes = {
  dispatch: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  guid: PropTypes.string.isRequired,
  services: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired
};

export default connect(null, null)(DeliveryDateSelector);
