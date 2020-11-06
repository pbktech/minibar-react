import React from 'react';
import { Button, Container, Col, Row, Alert } from 'react-bootstrap';
import '../pbk.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class Order extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      location: { services: [] }
    };
  }

  componentDidMount() {
    this.componentDidUpdate({ locations: {}, location: { services: [] } });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.locations.length !== this.props.locations.length) {
      this.props.locations.each((entry) => {
        if (entry.link === this.props.match.params.miniBar) {
          this.setState({
            location: entry
          });
        }
      });

      if (!this.state.location) {
        this.setState({
          error: 'Location Not Found'
        });
      }
    }
  }

  render() {
    if (this.state.error !== false) {
      return <Alert variant="danger">{this.state.error}</Alert>;
    }

    if (this.state.location !== {}) {
      return (
        <>
          <link rel="stylesheet" href="/App.css"/>
          <link rel="stylesheet" href="/pbk.css"/>
          <Container fluid>
            <Row>
              <Col>
                <h2>Order for {this.state.location.name}</h2>
                {this.state.location.services.map((entry) => {
                  return (
                    <Button href={'/order/' + this.state.location.link + '/' + entry.name + '/'} variant="brand">
                      Order {entry.name}
                    </Button>
                  );
                })}
              </Col>
            </Row>
          </Container>
        </>
      );
    }

    return <div>No locations</div>;
  }
}

Order.propTypes = {
  locations: PropTypes.array.isRequired,
  match: PropTypes.object.isRequired
};

Order.propTypes = {
  config: PropTypes.object.isRequired,
  locations: PropTypes.array.isRequired,
  match: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    locations: state.locations
  };
};

export default connect(mapStateToProps, null)(Order);
