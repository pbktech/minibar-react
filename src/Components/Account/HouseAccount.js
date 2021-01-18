import React from 'react';
import { setLoginObject } from '../../redux/actions/actions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import PaymentInputs from '../Common/PaymentInputs';
import Form from 'react-bootstrap/Form';
import * as utils from '../Common/utils';
import BootstrapTable from 'react-bootstrap-table-next';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import { Printer, Receipt } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import ReceiptModal from './ReceiptModal';
import Messages from '../Messages';
import images from 'react-payment-inputs/lib/images';

class HouseAccount extends React.Component {
  constructor(props, context) {
    super(props, context);
    const Config = require('../../config.json');

    this.setCard = this.setCard.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.luhnChecksum = this.luhnChecksum.bind(this);
    this.luhnValidate = this.luhnValidate.bind(this);
    this.getOutstandingHouse = this.getOutstandingHouse.bind(this);
    this.orderQueue = this.orderQueue.bind(this);
    this.showOrderDiv = this.showOrderDiv.bind(this);
    this.priceFormatter = this.priceFormatter.bind(this);
    this.addToTotal = this.addToTotal.bind(this);
    this.removeFromTotal = this.removeFromTotal.bind(this);
    this.closeReceipt = this.closeReceipt.bind(this);
    this.openReceipt = this.openReceipt.bind(this);
    this.processSale = this.processSale.bind(this);

    this.state = {
      Config,
      API: Config.apiAddress,
      amountToCharge: 0.00,
      ordersToCharge: [],
      validated: false,
      outstandingBalance: 0.00,
      outstandingOrders: [],
      processing: false,
      receiptGUID: '',
      receiptShow: false,
      error: [],
      card: {
        isValid: false,
        billingName: '',
        type: '',
        cvc: '',
        cardNumber: '',
        expiryDate: '',
      },
    };
  }

  componentDidMount() {
    if (this.props.comingFrom === 'accountPage') {
      this.getOutstandingHouse();
    }
  }

  setCard(card) {
    let isValid = this.state.card.isValid;

    let cvc = this.state.card.cvc;

    let cardNumber = this.state.card.cardNumber;

    let expiryDate = this.state.card.expiryDate;

    let billingName = this.state.card.billingName;

    switch (card.target.name) {
      case 'expiryDate':
        expiryDate = card.target.value;
        break;
      case 'cardNumber':
        cardNumber = card.target.value.replaceAll(' ', '');
        break;
      case 'cvc':
        cvc = card.target.value;
        break;
      case 'billingName':
        billingName = card.target.value;
        break;
      default:
    }

    if (card.target.name === 'cardNumber' && this.luhnValidate(cardNumber)) {
      isValid = true;
    } else {
      isValid = false;
    }
    this.setState({
      card: {
        isValid,
        billingName,
        cvc,
        cardNumber,
        expiryDate,
      },
    });
  }

  handleChange(e) {
    const name = e.target.name;
    const value = (e.target.type === 'checkbox') ? e.target.checked : e.target.value;
    const newState = {};

    if (name === 'useHouseAccount' && this.props.loggedIn.houseAccounts.length === 1) {
      if (e.target.checked === true) {
        newState.houseAccount = this.props.loggedIn.houseAccounts[0].guid;
        if (this.props.loggedIn.houseAccounts[0].maxIndividualOrder && this.props.loggedIn.houseAccounts[0].maxIndividualOrder > 0) {
          newState.maxOrder = this.props.loggedIn.houseAccounts[0].maxIndividualOrder;
        }
      } else {
        newState.houseAccount = '';
      }
    }

    newState[name] = value;
    this.setState(newState);
  }

  luhnChecksum(code) {
    const len = code.length;

    const parity = len % 2;

    let sum = 0;

    for (let i = len - 1; i >= 0; i--) {
      let d = parseInt(code.charAt(i));

      if (isNaN(d)) {
        continue;
      }

      if (i % 2 === parity) {
        d = d * 2;
      }

      if (d > 9) {
        d = d - 9;
      }

      sum = sum + d;
    }
    return sum % 10;
  }

  luhnValidate(fullcode) {
    return this.luhnChecksum(fullcode) === 0;
  }

  getOutstandingHouse() {
    const error = [];

    const confirm = {
      f: 'haBalance',
      sessionID: this.props.loggedIn.sessionID,
    };

    utils.ApiPostRequest(this.state.API + 'auth', confirm).then((data) => {
      if (data) {
        this.setState({
          outstandingBalance: data.balance,
          outstandingOrders: data.orders,
        });
      } else {
        error.push({ msg: 'An unexpected error occurred.', variant: 'danger' });
      }

      this.setState({
        error,
      });
    });
  }

  processSale() {
    const error = [];

    let outBalance = this.state.outstandingBalance;

    let outOrders = this.state.outstandingOrders;

    if (!this.state.card.billingName) {
      error.push({ msg: 'Please enter a billing name', variant: 'danger' });
    }

    if (!this.state.card.cardNumber) {
      error.push({ msg: 'Please enter a card number', variant: 'danger' });
    }
    if (!this.state.card.cvc) {
      error.push({ msg: 'Please enter a cvv', variant: 'danger' });
    }
    if (!this.state.card.expiryDate) {
      error.push({ msg: 'Please enter an expiration date', variant: 'danger' });
    }
    if (!this.luhnValidate(this.state.card.cardNumber)) {
      error.push({ msg: 'Invalid card number', variant: 'danger' });
    }
    if (!this.state.amountToCharge || !this.state.ordersToCharge.length) {
      error.push({ msg: 'Please select some orders to charge', variant: 'danger' });
    }

    if (!error.length) {
      this.setState({
        processing: true,
      });

      const confirm = {
        f: 'payBalance',
        session: this.props.loggedIn.sessionID,
        amountToCharge: this.state.amountToCharge,
        ordersToCharge: this.state.ordersToCharge,
        card: this.state.card,
      };

      utils.ApiPostRequest(this.state.API + 'checkout', confirm).then((data) => {
        if (data) {
          if (data.status && data.status === 200) {
            outBalance = data.balance.balance;
            outOrders = data.balance.orders;
            error.push({ msg: 'Payment Applied', variant: 'success' });
          } else {
            error.push({ msg: 'Payment Failure.', variant: 'danger' });
          }
        } else {
          error.push({ msg: 'An unexpected error occurred.', variant: 'danger' });
        }
        this.setState({
          outstandingBalance: outBalance,
          outstandingOrders: outOrders,
          processing: false,
          amountToCharge: 0,
          ordersToCharge: [],
          error,
        });
      });
    } else {
      this.setState({
        error,
      });
    }
  }

  addToTotal(guid) {
    let invoiceTotal = 0;
    const orderGUIDs = this.state.ordersToCharge;

    orderGUIDs.push(guid);
    orderGUIDs.map((entry) => {
      const guidSplit = entry.split('%');

      invoiceTotal = parseFloat(invoiceTotal) + parseFloat(guidSplit[1]);
    });

    this.setState({
      amountToCharge: invoiceTotal,
      ordersToCharge: orderGUIDs,
    });
  }

  removeFromTotal(guid) {
    const orderGUIDs = this.state.ordersToCharge.filter((item) => item !== guid);

    let invoiceTotal = 0;

    if (orderGUIDs.length) {
      orderGUIDs.map((entry) => {
        const guidSplit = entry.split('%');

        invoiceTotal = parseFloat(invoiceTotal) + parseFloat(guidSplit[1]);
      });
    }

    this.setState({
      amountToCharge: invoiceTotal,
      ordersToCharge: orderGUIDs,
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

  priceFormatter(cell) {
    return (
      <span>$ { cell } </span>
    );
  }

  orderQueue(orders) {
    if (orders && orders.length > 0) {
      const headerSortingStyle = { backgroundColor: '#c8e6c9' };
      const data = [];
      const columns = [{
        dataField: 'id',
        text: 'GUID',
        hidden: true,
      },
      {
        dataField: 'location',
        text: 'Minibar',
        sort: true,
        headerSortingStyle,
        headerStyle: {
          backgroundColor: '#FFFFFF',
          fontFamily: 'Trade Gothic Bold Condensed',
          color: '#0E2244',
        },
      },
      {
        dataField: 'amount',
        text: 'Amount Due',
        sort: true,
        headerSortingStyle,
        headerStyle: {
          backgroundColor: '#FFFFFF',
          fontFamily: 'Trade Gothic Bold Condensed',
          color: '#0E2244',
        },
        formatter: this.priceFormatter,
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
      const selectRow = {
        mode: 'checkbox',
        clickToSelect: true,
        style: { backgroundColor: '#c8e6c9' },
        onSelect: (row, isSelect) => {
          if (isSelect === true) {
            this.addToTotal(row.id + '%' + row.amount);
          } else {
            this.removeFromTotal(row.id + '%' + row.amount);
          }
        },
        onSelectAll: (isSelect) => {
          if (isSelect === true) {
            this.state.outstandingOrders.map((entry) => {
              this.addToTotal(entry.link + '%' + entry.total);
            });
          } else {
            this.setState({
              amountToCharge: 0.00,
              ordersToCharge: [],
            });
          }
        },
      };

      orders.map((entry) => {
        data.push({
          id: entry.link,
          location: entry.company,
          amount: entry.total,
          ordered: entry.dateOrdered,
          delivered: entry.dateDue,
          print: this.showOrderDiv(entry),
        });
      });
      const defaultSorted = [{
        dataField: 'delivered',
        order: 'desc',
      }];

      return <BootstrapTable keyField="id" data={data} columns={columns} selectRow={selectRow} keyField="id" bordered={false} defaultSorted={defaultSorted} striped hover condensed />;
    }
    return (<div className="text-muted">There are no orders yet.</div>);
  }

  showOrderDiv(entry) {
    return (
      <ButtonToolbar>
        <ButtonGroup>
          <Button variant={'link'} data-guid={entry.link} onClick={this.openReceipt}><Receipt size={18} data-guid={entry.link} /></Button>
          <Link to={'/receipt/' + entry.link + '?print=true'} target="_blank"><Button variant={'link'}><Printer size={18} /></Button></Link>
        </ButtonGroup>
      </ButtonToolbar>
    );
  }

  render() {
    if (this.state.processing) {
      return (
        <Container style={{ textAlign: 'center' }}>
          <Spinner animation="border" role="status">
            <span className="sr-only">Processing...</span>
          </Spinner>
        </Container>
      );
    }
    return (
      <Container fluid style={{ padding: '1em' }}>
        {this.state.error.length > 0 && this.state.error.map((entry, i) => {
          return (<Messages key={'message_' + i} variantClass={entry.variant} alertMessage={entry.msg} />);
        }
        )}
        <ReceiptModal receiptGUID={this.state.receiptGUID} receiptShow={this.state.receiptShow} closeReceipt={this.closeReceipt} />
        {this.state.outstandingBalance ? (
          <Row style={{ paddingTop: '1em' }}>
            <Col style={{ width: '50%' }}>
              <Row>
                <h3>Outstanding Balance</h3>
              </Row>
              <Row><h4 style={{ paddingTop: '1em', textIndent: '1em' }}>${this.state.outstandingBalance}</h4></Row>
              <Row>
                <h3 style={{ paddingTop: '1em' }}>Make a Payment</h3>
              </Row>
              <Row>
                <Form validated={this.state.validated}>
                  <Form.Row style={{ width: '100%' }}>
                    <Form.Group as={Col} controlId="yourName" style={{ paddingTop: '1em', width: '100%' }}>
                      <Form.Label style={{ fontWeight: 'bold' }}>Amount to Charge:</Form.Label>
                      <Form.Control type="text" placeholder="" disabled name="amountToCharge" value={this.state.amountToCharge} />
                    </Form.Group>
                  </Form.Row>
                  <Form.Row style={{ width: '100%' }}>
                    <Form.Group as={Col}>
                      <Form.Label style={{ fontWeight: 'bold' }}>Billing Name</Form.Label>
                      <Form.Control name={'billingName'} onChange={this.setCard} value={this.state.card.billingName} />
                    </Form.Group>
                  </Form.Row>
                  <Form.Row style={{ width: '100%' }}>
                    <Form.Group as={Col} controlId="creditCard" style={{ paddingTop: '1em', width: '100%' }}>
                      <PaymentInputs setCard={this.setCard} />
                    </Form.Group>
                  </Form.Row>
                  {
                    this.state.amountToCharge ? (
                      <Form.Row style={{ width: '100%' }}>
                        <Form.Group as={Col} controlId="creditCard" style={{ paddingTop: '1em', width: '100%' }}>
                          <Button variant={'brand'} onClick={this.processSale}>Pay ${this.state.amountToCharge}</Button>
                        </Form.Group>
                      </Form.Row>
                    ) : (<></>)
                  }
                </Form>
              </Row>
            </Col>
            <Col style={{ width: '50%' }}>
              <Row>
                <h3>House Account Orders</h3>
              </Row>
              <Row>
                <div style={{ width: '95%' }}>
                  {this.orderQueue(this.state.outstandingOrders)}
                </div>
              </Row>
            </Col>
          </Row>
        ) : (<h3>No outstanding balance at this time.</h3>)

        }
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
  };
};

HouseAccount.propTypes = {
  loggedIn: PropTypes.object,
  setLoginObject: PropTypes.func.isRequired,
  comingFrom: PropTypes.string,
};

export default connect(mapStateToProps, mapDispatchToProps)(HouseAccount);
