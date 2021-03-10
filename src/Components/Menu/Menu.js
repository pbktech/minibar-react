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
import { decodeFormData, sortByPropertyCaseInsensitive } from '../Common/utils';
import PropTypes from 'prop-types';
import { CartCss } from '../Common/utils';
import { Redirect } from 'react-router-dom';
import * as utils from '../Common/utils';
import Messages from '../Messages';
import Login from '../Login';
import { Link } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.pullMenu = this.pullMenu.bind(this);
    const Config = require('../../config.json');

    this.state = {
      Config,
      API: Config.apiAddress,
      error: [],
      location: { services: [] },
      menus: [],
      tooLate: false,
      returnHome: false,
    };
  }

  componentDidMount() {
    this.pullMenu();
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

      if (this.props.delivery.service !== this.props.match.params.service) {
        this.props.locations.forEach((entry) => {
          this.setState({
            location: entry,
          });
          if (entry.link === this.props.match.params.miniBar) {
            entry.services.forEach((service) => {
              if (service.name === this.props.match.params.service) {
                this.setState({
                  menus: service.menus,
                });
                const parseOrderDate = service.orderDates[0].split(' - ');

                let actualOrderDate = '';

                if (parseOrderDate[1]) {
                  actualOrderDate = parseOrderDate[1];
                } else {
                  actualOrderDate = service.orderDates[0];
                }
                this.props.setDeliveryDate({
                  location: entry.name,
                  guid: entry.guid,
                  date: actualOrderDate,
                  service: this.props.match.params.service,
                  cutOffTime: service.cutOffTime,
                  link: entry.link,
                  delservices: entry.services,
                  deliveryTime: service.deliveryTime,
                  headerGUID: '',
                });
              }
            });
          }
        });
      }

      if (!this.state.location) {
        this.setState({
          error: 'Location Not Found',
        });
      }
    }
  }

  pullMenu() {
    const error = this.state.error;

    const confirm = {
      f: 'getmenu',
      minibar: this.props.match.params.miniBar,
      service: this.props.match.params.service,
    };

    utils.ApiPostRequest(this.state.API, confirm).then((data) => {
      if (data) {
        if (data.toolate) {
          this.setState({
            tooLate: true,
          });
        }
        if (data.menus && data.menus.length && data.menus.length > 0) {
          this.setState({
            menus: data.menus,
          });
          if (data.headerGUID !== '') {
            this.props.setDeliveryDate({
              location: data.company,
              guid: data.guid,
              date: data.dateDue,
              service: data.mbService,
              cutOffTime: data.cutoff,
              link: this.props.match.params.miniBar,
              headerGUID: data.headerGUID,
              payerType: data.payerType,
              deliveryTime: data.delivery,
              paymentHeader: data.paymentHeader,
              url: this.props.match.params.service,
              maximumCheck: data.maximumCheck,
            });
          }
        } else {
          error.push({ msg: 'an error occurred, no menus.', variant: 'danger' });
        }
      } else {
        error.push({ msg: 'An unexpected error occurred.', variant: 'danger' });
      }

      this.setState({
        error,
      });
    });
  }

  render() {
    let menus = [];

    if (this.state.tooLate) {
      return (
        <Container style={{ paddingTop: '1em' }}>
          <Alert variant={'warning'}>This order has expired</Alert>
        </Container>);
    }
    if (this.state.menus.length > 0) {
      menus = this.state.menus.slice();
    } else {
      return (
        <Container>
          <h2>Loading...</h2>
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </Container>
      );
    }
    if (this.state.returnHome) {
      return (
        <Redirect to={'/'} />
      );
    }
    if (this.state.error === true) {
      return (
        <Container>
          <Messages variantClass="warning" alertMessage="You have clicked an invalid link." />
          <div className="site-nav">
            <ul className="site-nav-menu">
              <Login />
              <li>
                <Link to={'/'}>Start a new order.</Link>
              </li>
            </ul>
          </div>
        </Container>
      );
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
                fluid
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
                <Cart services={this.props.delivery.delservices} name={this.props.delivery.location} guid={this.props.delivery.guid} link={this.props.delivery.link} />
              </Container>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    delivery: state.delivery,
    locations: state.locations,
    config: state.config,
  };
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
