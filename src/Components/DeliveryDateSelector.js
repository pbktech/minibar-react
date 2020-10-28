import React from 'react';
import { setDeliveryDate } from '../redux/actions/actions';
import { connect } from 'react-redux';
import { Modal, Button, Form } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { encodeFormData } from './Common/utils';
import PropTypes from 'prop-types';

class DeliveryDateSelector extends React.Component {
  constructor(props) {
    super(props);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.setRedirect = this.setRedirect.bind(this);
    this.setValidated = this.setValidated.bind(this);
    this.clearValidated = this.clearValidated.bind(this);
    this.state = {
      show: this.props.show,
      deliveryDate: '',
      service: '',
      cutOffTime: '',
      deliveryTime: '',
      clickDate: '',
      toOrder: false,
      validated: false,
    };
  }

  componentDidMount() {
    if (this.props.delivery.service) {
      this.setState({
        deliveryDate: this.props.delivery.deliveryDate,
        service: this.props.delivery.service,
        cutOffTime: this.props.delivery.cutOffTime,
        deliveryTime: this.props.delivery.deliveryTime,
      });
    }
  }

  setRedirect(e) {
    this.setState({ toOrder: e });
  }

  setValidated() {
    this.setState({ validated: true });
  }

  clearValidated() {
    this.setState({ validated: false });
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  handleChange(e) {
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }

    this.setValidated();

    if (e.target.name === 'deliveryDate') {
      const res = e.target.value.split('-');
      const cookies = new Cookies();

      this.setState(
        {
          service: res[0],
          deliveryDate: res[1],
          cutOffTime: res[2],
          deliveryTime: res[3],
          clickDate: res[0]+'-'+res[4],
        },
        () => {
          cookies.set(
            'delivery',
            encodeFormData({
              location: this.props.name,
              guid: this.props.guid,
              date: this.state.deliveryDate,
              service: this.state.service,
              cutOffTime: this.state.cutOffTime,
              deliveryDate: this.state.deliveryDate,
              link: this.props.link,
              delservices: this.props.services,
              deliveryTime: this.state.deliveryTime,
              isGroup: 0,
            }),
            { path: '/' }
          );

          this.props.setDeliveryDate({
            location: this.props.name,
            guid: this.props.guid,
            date: this.state.deliveryDate,
            service: this.state.service,
            cutOffTime: this.state.cutOffTime,
            link: this.props.link,
            delservices: this.props.services,
            deliveryTime: this.state.deliveryTime,
          });
        }
      );
    }
  }

  render() {
    if (this.state.toOrder) {
      return (
        <Redirect from="/" to={this.state.toOrder} />
      );
    }
    return (
      <div>
        <Modal show={this.props.show} onHide={this.props.handleClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title><h2>When do you want this delivered?</h2><span style={{ fontFamily: 'Lora', color: '#acaeb0', textTransform: 'capitalize', fontSize: '15px' }}>Orders available for {this.props.name + ' ' + this.props.building} only at this PBK Minibar location</span></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {this.props.services.map((entry, i) => {
                return (
                  <div key={'service' + i}>
                    <h3 key={'servicename' + i}>{entry.name}</h3><small style={{ fontFamily: 'Lora', color: '#acaeb0' }}>Orders must be submitted before {entry.cutOffTime} for a {entry.deliveryTime} delivery.</small><br />
                    {entry.orderDates.length && entry.orderDates.map((orderDate, ia) => {
                      const parseOrderDate = orderDate.split(' - ');

                      let actualOrderDate = '';

                      if (parseOrderDate[1]) {
                        actualOrderDate = parseOrderDate[1];
                      } else {
                        actualOrderDate = orderDate;
                      }
                      return (
                        <div key={'option' + ia} className="mb-3">
                          <Form.Check type="radio" id={`deliveryDate-${entry.name}-${ia}`}>
                            <Form.Check.Input
                              onChange={this.handleChange}
                              name="deliveryDate"
                              type="radio"
                              value={entry.name + '-' + actualOrderDate + '-' + entry.cutOffTime + '-' + entry.deliveryTime + '-' + ia}
                              checked={entry.name + '-' + ia === this.state.clickDate} />
                            <Form.Check.Label>
                              {parseOrderDate[1] ? (<strong style={{ color: '#F36C21' }}>{parseOrderDate[0]}</strong>) : (<>{orderDate}</>)}
                            </Form.Check.Label>
                          </Form.Check>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            {this.props.service
              ? (
                <Button
                  variant="warning"
                  onClick={() => {
                    this.props.setDeliveryDate({
                      location: '',
                      guid: '',
                      date: '',
                      service: '',
                      cutOffTime: '',
                      deliveryDate: '',
                      deliveryTime: '',
                    });
                    this.props.handleClose();
                    this.setRedirect('/');
                  }} >
                  Restart
                </Button>
              ) : (<></>)}
            <Button variant="secondary" onClick={this.props.handleClose}>
              Close
            </Button>
            <Button
              variant="brand"
              onClick={() => {
                this.props.setDeliveryDate({
                  location: this.props.name,
                  guid: this.props.guid,
                  date: this.state.deliveryDate,
                  service: this.state.service,
                  cutOffTime: this.state.cutOffTime,
                  deliveryDate: this.state.deliveryDate,
                  link: this.props.link,
                  delservices: this.props.services,
                  deliveryTime: this.state.deliveryTime,
                });
                this.props.handleClose();
                this.setRedirect('/order/' + this.props.link + '/' + this.state.service);
              }} disabled={this.state.deliveryDate === ''}>
              Start Order
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { delivery: state.delivery };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setDeliveryDate: (delivery) => {
      dispatch(setDeliveryDate(delivery));
    },
  };
};

DeliveryDateSelector.propTypes = {
  name: PropTypes.string.isRequired,
  guid: PropTypes.string.isRequired,
  services: PropTypes.array.isRequired,
  link: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
  setDeliveryDate: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  delivery: PropTypes.object.isRequired,
  building: PropTypes.string,
  service: PropTypes.string,
};

export default connect(mapStateToProps, mapDispatchToProps)(DeliveryDateSelector);
