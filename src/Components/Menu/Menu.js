import React from 'react';
import { setDeliveryDate } from '../../redux/actions/actions';
import { connect } from 'react-redux';
import Container from 'react-bootstrap/Container';
import MenuGroup from './MenuGroup';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import ScrollToTop from 'react-scroll-to-top';
import Cart from '../Cart';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import '../../pbk.css';
import Cookies from 'universal-cookie';
import { decodeFormData, sortByPropertyCaseInsensitive } from '../../utils';
import PropTypes from 'prop-types';
import { CartCss } from '../../utils';

class Menu extends React.Component {
  constructor(props) {
    super(props);

    const cookies = new Cookies();
    const delivery = decodeFormData(cookies.get('delivery'));

    this.state = {
      error: false,
      location: { services: [] },
      menus: [],
      delivery,
    };

    if (!this.props.deliveryDate && delivery) {
      this.props.setDeliveryDate(delivery);
    } else {
      // eslint-disable-next-line no-warning-comments
      // TODO: add default delivery date or force user to choose a new one
      // eslint-disable-next-line no-console
      console.log('need delivery date');
    }
  }

  componentDidMount() {
    this.componentDidUpdate({ locations: {}, location: { services: [] } });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.locations.length !== this.props.locations.length) {
      this.props.locations.forEach((entry) => {
        if (entry.link === this.props.match.params.miniBar) {
          this.setState({
            location: entry,
          });
          entry.services.forEach((service) => {
            if (service.name === this.props.match.params.service) {
              this.setState({
                menus: service.menus,
              });
            }
          });
        }
      });
      if (!this.state.location) {
        this.setState({
          error: 'Location Not Found',
        });
      }
    }
  }

  render() {
    let menus = [];

    if (this.state.menus.length > 0) {
      menus = this.state.menus.slice();
    }

    return (
      <>
        <CartCss />
        <Container style={{ paddingTop: '1em' }} fluid>
          <Row>
            <Col className="col-sm-8">
              <Container>
                <Tabs defaultActiveKey="tab0">
                  {menus.length && menus
                    .sort((a, b) => sortByPropertyCaseInsensitive(a, b, 'sort'))
                    .map((entry, i) => {
                      return (
                        <Tab key={'tab_' + i} eventKey={'tab' + i} title={entry.menuName} className="">
                          <MenuGroup key={'menuGroup_' + i} menuGroups={entry.menuGroups} />
                        </Tab>
                      );
                    })}
                </Tabs>
                <ScrollToTop smooth color="#F36C21" />
              </Container>
            </Col>
            <Col className="col-sm-4" style={{ position: 'fixed' }}>
              <Container
                className="d-none d-lg-block d-print-block"
                style={{
                  borderLeft: '1px solid #dee2e6',
                  height: '100vh',
                  paddingLeft: '2em',
                  position: 'fixed',
                  top: '100px',
                  right: '10px',
                  width: '25%',

                }}>
                <h2>Your Order</h2>
                <Cart />
              </Container>
            </Col>
          </Row>
        </Container>
      </>
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

Menu.propTypes = {
  deliveryDate: PropTypes.string,
  match: PropTypes.object.isRequired,
  setDeliveryDate: PropTypes.func.isRequired,
  locations: PropTypes.array.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
