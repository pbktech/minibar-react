import React from 'react';
import DeliveryDateSelector from './DeliveryDateSelector.js';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

class Location extends React.Component {
  constructor(props) {
    super(props);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      show: false,
      deliveryDate: '',
    };
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  handleChange(e) {
    if (e.target.name === 'deliveryDate') {
      this.setState(
        {
          deliveryDate: e.target.value,
        });
    }
  }

  render() {
    return (
      <div className="locationListItem">
        <Link to="#" onClick={this.handleShow}>
          <h3 style={{ fontSize: '18px' }}>
            {'Minibar @ ' + this.props.location.name}
          </h3>
        </Link>
        <div style={{ fontFamily: 'Lora', fontSize: '13px' }}>
          {this.props.location.address} {this.props.location.suite}
          <br />
          {this.props.location.city}, {this.props.location.state}{' '}
          {this.props.location.zip}
        </div>
        <div style={{paddingTop:"1em"}}>
          <Button variant="brand" onClick={this.handleShow}>
            Order Now
          </Button>

          <DeliveryDateSelector show={this.state.show} handleClose={this.handleClose} services={this.props.location.services} name={this.props.location.name} building={this.props.location.building} guid={this.props.location.guid} link={this.props.location.link} />
        </div>
        <hr className="locationListItem-break" />
      </div>
    );
  }
}

Location.propTypes = {
  location: PropTypes.object.isRequired,
};

export default Location;
