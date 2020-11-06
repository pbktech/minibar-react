import React from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Messages from './Messages.js';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import * as utils from './Common/utils.js';
import { Key, Check, Trash, Receipt, Printer, Clipboard } from 'react-bootstrap-icons';
import InputGroup from 'react-bootstrap/InputGroup';
import { removeAddress, setLoginObject } from '../redux/actions/actions';
import { connect } from 'react-redux';
import Login from './Login';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { AddressLayout } from './Common/AddressLayout';
import { Link } from 'react-router-dom';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Home from './Home';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import paginationFactory from 'react-bootstrap-table2-paginator';
import OrderLink from './Account/OrderLink';
import Alert from 'react-bootstrap/Alert';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Personal from './Account/Personal';
import HouseAccount from './Account/HouseAccount';

class Account extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.checkHEXLink = this.checkHEXLink.bind(this);
    this.newPasswordForm = this.newPasswordForm.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.clearValidated = this.clearValidated.bind(this);
    this.setValidated = this.setValidated.bind(this);
    this.addAddress = this.addAddress.bind(this);
    this.setAddress = this.setAddress.bind(this);
    this.openReceipt = this.openReceipt.bind(this);
    this.closeReceipt = this.closeReceipt.bind(this);
    this.orderQueue = this.orderQueue.bind(this);
    this.showOrderDiv = this.showOrderDiv.bind(this);
    this.removeAddress = this.removeAddress.bind(this);

    const Config = require('../config.json');

    this.state = {
      Config,
      API: Config.apiAddress,
      show: false,
      error: [],
      variantClass: '',
      alertMessage: '',
      value: '',
      copied: false,
      linkHEX: '',
      password_confirm: '',
      password: '',
      emailShow: false,
      email: '',
      phoneShow: false,
      phoneNumber: '',
      guestNameShow: false,
      guestName: '',
      addressShow: false,
      passwordShow: false,
      groupShow: false,
      receiptShow: false,
      receiptGUID: '',
      addressID: 0,
      address: {
        isDeleted: 0,
        type: 'billing',
        street: '',
        city: '',
        state: 'Illinois',
        zip: '',
      },
    };
  }

  componentDidMount() {
    if (this.props.match.params.linkHEX) {
      this.checkHEXLink();
    }
  }

  componentDidUpdate(prevProps) {

  }

  handleChange(e) {
    const name = e.target.name;
    const value = (e.target.type === 'checkbox') ? e.target.checked : e.target.value;

    const newState = {};

    newState[name] = value;
    this.setState(newState);
  }

  removeAddress(e) {
    const error = [];

    const confirm = {
      f: 'removeAddress',
      session: this.props.loggedIn.sessionID,
      addressID: e.target.dataset.address,
    };

    utils.ApiPostRequest(this.state.API + 'auth', confirm).then((data) => {
      if (data) {
        if (data.status && data.status === 200) {
          this.props.removeAddress(parseInt(e.target.dataset.index, 10));
          error.push({ msg: data.msg, variant: 'success' });
        } else {
          error.push({ msg: data.msg, variant: 'danger' });
        }
      } else {
        error.push({ msg: 'An unexpected error occurred.', variant: 'danger' });
      }

      this.setState({
        error,
      });
    });
  }

  setAddress(address) {
    const type = 'billing';

    let street = this.state.address.street;

    let city = this.state.address.city;

    let state = this.state.address.state;

    let zip = this.state.address.zip;

    if (typeof (address) === 'string') {
      state = address;
    } else {
      switch (address.target.name) {
        case 'street':
          street = address.target.value;
          break;
        case 'city':
          city = address.target.value;
          break;
        case 'state':
          state = address.target.value;
          break;
        case 'zip':
          zip = address.target.value;
          break;
        default:
      }
    }
    this.setState({
      address: {
        type,
        street,
        city,
        state,
        zip,
      },
    });
  }

  openReceipt(e) {
    this.setState({
      receiptShow: true,
      receiptGUID: e.target.dataset.guid,
    });
  }


  closeReceipt() {
    this.setState({
      receiptShow: false,
      receiptGUID: '',
    });
  }

  handleClose(e) {
    if (e) {
      const name = e.target.dataset.name;
      const newState = this.state;

      newState[name] = false;
      this.setState(newState);
    }
  }

  handleShow(e) {
    if (e) {
      const name = e.target.dataset.name;
      const newState = this.state;

      newState[name] = true;
      this.setState(newState);
    }
  }

  addAddress() {
    const error = this.state.error;

    const confirm = {
      f: 'addAddress',
      user: this.props.loggedIn.email,
      session: this.props.loggedIn.sessionID,
      address: this.state.address,
    };

    utils.ApiPostRequest(this.state.API + 'auth', confirm).then((data) => {
      if (data) {
        if (data.Variant && data.Variant === 'success') {
          const addresses = [...this.props.loggedIn.addresses];

          const address = { ...data.address };

          address.addressId = data.address;
          addresses.push(this.state.address);
          this.props.setLoginObject({
            ...this.props.loggedIn,
            addresses,
          });
          this.setState({
            addressShow: false,
            address: {
              isDeleted: 0,
              type: 'billing',
              street: '',
              city: '',
              state: 'Illinois',
              zip: '',
            },
          });
          this.handleClose();
          error.push({ msg: data.message, variant: 'success' });
        } else {
          error.push({ msg: data.message, variant: 'danger' });
        }
      } else {
        error.push({ msg: 'An unexpected error occurred.', variant: 'danger' });
      }

      this.setState({
        error,
      });
    });
  }

  checkHEXLink() {
    const request = {
      f: 'checklink',
      linkHEX: this.props.match.params.linkHEX,
      reason: 'forgot_password',
    };

    utils.ApiPostRequest(this.state.API + 'auth', request).then((data) => {
      if (data) {
        if (data.Variant !== 'success') {
          this.setState({
            error: data.message,
            variantClass: data.Variant,
          });
        } else {
          this.setState({
            linkHEX: this.props.match.params.linkHEX,
          });
        }
      } else {
        this.setState({
          error: [{ msg: 'An unexpected error occurred.', variant: 'danger' }],
        });
      }
    });
  }

  setValidated() {
    this.setState({ validated: true });
  }

  clearValidated() {
    this.setState({ validated: false });
  }

  changePassword(event) {
    const form = event.currentTarget;

    if (this.state.password !== this.state.password_confirm) {
      event.preventDefault();
      event.stopPropagation();
      this.setState({
        error: 'Passwords do not match',
        variantClass: 'danger',
      });
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    this.setValidated();
    if (form.checkValidity() === false) {
      return;
    }

    const request = {
      f: 'updatepass',
      linkHEX: this.state.linkHEX,
      password: this.state.password,
    };

    utils.ApiPostRequest(this.state.API + 'auth', request).then((data) => {
      if (data) {
        this.setState({
          formSubmitted: true,
          error: data.message,
          variantClass: data.Variant,
          linkHEX: '',
        });
      } else {
        this.setState({
          error: [{ msg: 'An unexpected error occurred.', variant: 'danger' }],
        });
      }
    });
  }

  showOrderDiv(entry) {
    return (
      <ButtonToolbar>
        <ButtonGroup>
          <Button variant={'link'} data-guid={entry.checkGUID} onClick={this.openReceipt}><Receipt size={18} data-guid={entry.checkGUID} /></Button>
          <Link to={'/receipt/' + entry.checkGUID + '?print=true'} target="_blank"><Button variant={'link'}><Printer size={18} /></Button></Link>
        </ButtonGroup>
      </ButtonToolbar>
    );
  }

  orderQueue(orders) {
    if (orders && orders.length > 0) {
      const headerSortingStyle = { backgroundColor: '#c8e6c9' };
      const data = [];
      const columns = [{
        dataField: 'location',
        text: 'Minibar',
        sort: true,
        headerSortingStyle,
        headerStyle: {
          backgroundColor: '#FFFFFF',
          fontFamily: 'Trade Gothic Bold Condensed',
          color: '#0E2244',
        },
      }, {
        dataField: 'ordered',
        text: 'Date Ordered',
        sort: true,
        headerSortingStyle,
        headerStyle: {
          backgroundColor: '#FFFFFF',
          fontFamily: 'Trade Gothic Bold Condensed',
          color: '#0E2244',
        },
      }, {
        dataField: 'delivered',
        text: 'Date Delivered',
        sort: true,
        headerSortingStyle,
        headerStyle: {
          backgroundColor: '#FFFFFF',
          fontFamily: 'Trade Gothic Bold Condensed',
          color: '#0E2244',
        },
      }, {
        dataField: 'print',
        text: 'Actions',
        headerStyle: {
          backgroundColor: '#FFFFFF',
          fontFamily: 'Trade Gothic Bold Condensed',
          color: '#0E2244',
        },
      }];

      orders.map((entry, i) => {
        data.push({
          location: entry.company,
          ordered: entry.orderDate,
          delivered: entry.dateDue,
          print: this.showOrderDiv(entry),
        });
      });
      const defaultSorted = [{
        dataField: 'delivered',
        order: 'desc',
      }];

      return <BootstrapTable keyField="id" data={data} columns={columns} pagination={paginationFactory()} headerClasses="h4" bordered={false} defaultSorted={defaultSorted} striped hover condensed />;
    }
    return (<div className="text-muted">There are no orders yet.</div>);
  }

  newPasswordForm() {
    return (
      <Form noValidate validated={this.state.validated} onSubmit={this.changePassword}>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text id="inputGroupPrepend">
                <Key />
              </InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control type="password" name="password" onChange={this.handleChange} required />
            <Form.Control.Feedback type="invalid">
              Please provide a valid password
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
        <Form.Group controlId="password_confirm">
          <Form.Label>Password Confirmation</Form.Label>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text id="inputGroupPrepend">
                <Check />
              </InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control type="password" name="password_confirm" onChange={this.handleChange} required />
            <Form.Control.Feedback type="invalid">
              Please provide a valid password
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
        <Form.Group controlId="">
          <Button type="submit" variant="brand">Change Password</Button>
        </Form.Group>
      </Form>
    );
  }

  render() {
    const groupStyles = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    };
    const groupBadgeStyles = {
      backgroundColor: '#EBECF0',
      borderRadius: '2em',
      color: '#172B4D',
      display: 'inline-block',
      fontSize: 12,
      fontWeight: 'normal',
      lineHeight: '1',
      minWidth: 1,
      padding: '0.16666666666667em 0.5em',
      textAlign: 'center',
    };

    return (
      <Container style={{ paddingTop: '1em' }} fluid>
        {this.state.error.length > 0 && this.state.error.map((entry, i) => {
          return (<Messages key={'message_' + i} variantClass={entry.variant} alertMessage={entry.msg} />);
        })}
        {this.state.linkHEX ? (
          <Container>
            <h3>Create a new password</h3>
            {this.newPasswordForm()}
          </Container>
        ) : (
          this.props.loggedIn.sessionID ? (
            <>
              <Container fluid style={{ paddingTop: '1em' }}>
                <h2>My Account</h2>
                <Container fluid style={{ paddingTop: '1em' }}>
                  <Tabs defaultActiveKey="tab0">
                    <Tab eventKey={'tab0'} title={'Personal'} className="">
                      <Container fluid style={{ padding: '1em' }}>
                        <h2>Personal</h2>
                        <Row>
                          <Col style={{ width: '50%' }}>
                            <Row>
                              <h3>Personal Information</h3>
                            </Row>
                            <Row>
                              <Personal target={'real_name1'} name={this.props.loggedIn.guestName} label={'Your Name'} fieldName={'guestName'} />
                            </Row>
                            <Row>
                              <Personal target={'phone_number'} name={this.props.loggedIn.phone} label={'Phone Number'} fieldName={'phone'} />
                            </Row>
                            <Row>
                              <Personal target={'email_address'} name={this.props.loggedIn.email} label={'Email Address'} fieldName={'email'} />
                            </Row>
                            <Row>
                              <div style={{ fontWeight: 'bold' }}>
                                <Button variant={'link'} data-name="passwordShow" onClick={this.handleShow}>
                                  Change Password
                                </Button>
                                <Modal data-name="passwordShow" show={this.state.passwordShow} onHide={this.handleClose}>
                                  <Modal.Header><Modal.Title as="h2">Change Password</Modal.Title></Modal.Header>
                                  <Modal.Body>
                                    {this.newPasswordForm()}
                                  </Modal.Body>
                                  <Modal.Footer>
                                    <Button variant={'secondary'} data-name="passwordShow" onClick={this.handleClose}>Cancel</Button>
                                    <Button variant={'brand'} onClick={this.addAddress}>Save</Button>
                                  </Modal.Footer>
                                </Modal>
                              </div>
                            </Row>
                          </Col>
                          <Col style={{ width: '50%' }}>
                            <Row>
                              <h3>Address Manager</h3>
                            </Row>
                            <Row>
                              <div>
                                {this.props.loggedIn.addresses.length && this.props.loggedIn.addresses.filter((location) => location.type === 'billing').map((entry, i) => {
                                  return (
                                    <Row key={'option' + i} className="mb-3" style={{ paddingTop: '1em' }}>
                                      <Col className="col-sm-9" key={i}>
                                        {entry.street}<br />{entry.city}, {entry.state}
                                      </Col>
                                      <Col className="col-sm-3">
                                        <Button data-index={i} data-address={entry.addressID} variant="outline-danger" onClick={this.removeAddress}>
                                          <Trash style={{ color: '#dc3545' }} data-index={i} data-address={entry.addressID} />
                                        </Button>
                                      </Col>
                                    </Row>
                                  );
                                })

                                }
                              </div>
                            </Row>
                            <Row>
                              <Button variant={'link'} data-name="addressShow" onClick={this.handleShow}>
                                Add an address
                              </Button>
                              <Modal show={this.state.addressShow} onHide={this.handleClose}>
                                <Modal.Header><Modal.Title as="h2">Add an address</Modal.Title></Modal.Header>
                                <Modal.Body>
                                  <AddressLayout setAddress={this.setAddress} state={'Illinois'} address={this.state.address} />
                                </Modal.Body>
                                <Modal.Footer>
                                  <Button variant={'secondary'} data-name="addressShow" onClick={this.handleClose}>Cancel</Button>
                                  <Button variant={'brand'} onClick={this.addAddress}>Save</Button>
                                </Modal.Footer>
                              </Modal>
                            </Row>
                          </Col>
                        </Row>
                      </Container>
                    </Tab>
                    <Tab eventKey={'tab1'} title="Share" className="">
                      <Container fluid style={{ padding: '1em' }}>
                        <h2>Sharing</h2>
                        <Row>
                          <Col style={{ width: '50%' }}>
                            <Row>
                              <h3>New Group Orders</h3>
                            </Row>
                            <Button variant={'link'} data-name="groupShow" onClick={this.handleShow}>
                              Create a group order
                            </Button>
                            {this.props.loggedIn.addresses.length
                              ? (
                                <>
                                  <OrderLink
                                    show={this.state.groupShow} handleClose={() => {
                                      this.setState({ groupShow: false });
                                    }} locations={this.props.locations} addresses={this.props.loggedIn.addresses} />
                                </>
                              ) : (
                                <>
                                  <Alert variant={'warning'}>You must have addresses saved to create a group order.</Alert>
                                </>
                              )
                            }
                          </Col>
                          <Col style={{ width: '50%' }}>
                            <Row>
                              <h3>Upcoming Group Orders</h3>
                            </Row>
                            <Row>
                              {this.props.loggedIn.groupLinks.length > 0
                                ? (
                                  <>
                                    <ul style={{ listStyleType: 'none' }}>
                                      {this.props.loggedIn.groupLinks.map((entry, i) => {
                                        return (
                                          <>
                                            <li>
                                              <Button variant="link" href={'https://www.pbkminibar.com/order/' + entry.linkSlug + '/' + entry.linkHEX} target={'_blank'}>{entry.mbService} on {entry.orderDate}</Button>
                                              <CopyToClipboard
                                                text={'https://www.pbkminibar.com/order/' + entry.linkSlug + '/' + entry.linkHEX}
                                                onCopy={() => this.setState({ error: [{ msg: 'Link Copied', variant: 'success' }] })}>
                                                <Button variant="link" title={'Click to copy link to clipboard.'}><Clipboard size={18} /></Button>
                                              </CopyToClipboard>
                                            </li>
                                          </>);
                                      })}
                                    </ul>
                                  </>
                                ) : (
                                  <>
                                    <div className="text-muted">There are no orders yet.</div>
                                  </>
                                )
                              }
                            </Row>
                          </Col>
                        </Row>
                      </Container>
                    </Tab>
                    <Tab eventKey={'tab2'} title="Orders" className="">
                      <Container fluid style={{ padding: '1em' }}>
                        <h2>Previous Orders</h2>
                        <Row>
                          <Col style={{ width: '50%' }}>
                            <Row>
                              <h3>Individual Minibar Orders</h3>
                            </Row>
                            <Row>
                              <div style={{ width: '95%' }}>
                                {this.orderQueue(this.props.loggedIn.orders)}
                              </div>
                            </Row>
                          </Col>
                          <Col style={{ width: '50%' }}>
                            <Row>
                              <h3>Group Minibar Orders</h3>
                            </Row>
                            <Row>
                              <div style={{ width: '95%' }}>
                                {this.orderQueue(this.props.loggedIn.groupOrders)}
                              </div>
                            </Row>
                          </Col>
                        </Row>
                      </Container>
                    </Tab>
                    {
                      this.props.loggedIn.houseAccounts.length !== 0 ? (
                        <Tab eventKey={'tab3'} title="House Account" className="">
                          <HouseAccount />
                        </Tab>
                      ) : (<></>)
                    }
                  </Tabs>
                </Container>
              </Container>
              <Modal show={this.state.receiptShow} size="lg">
                <Modal.Body>
                  <Home guid={this.state.receiptGUID} />
                </Modal.Body>
                <Modal.Footer>
                  <Button variant={'secondary'} data-name="receiptShow" onClick={this.closeReceipt}>Close</Button>
                </Modal.Footer>
              </Modal>
            </>
          ) : (
            <>
              <Container>
                <h2>Please Login</h2>
                <ul className="site-nav" style={{ textAlign: 'left' }}>
                  <ul className="site-nav-menu" data-menu-type="desktop">
                    <Login />
                  </ul>
                </ul>
              </Container>
            </>
          )

        )}
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return { loggedIn: state.loggedIn };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setLoginObject: (loggedIn) => {
      dispatch(setLoginObject(loggedIn));
    },
    removeAddress: (item) => {
      dispatch(removeAddress(item));
    },
  };
};

Account.propTypes = {
  loggedIn: PropTypes.object,
  setLoginObject: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Account);
