import React, { useState } from 'react';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import { Printer, Receipt } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form'
import Spinner from 'react-bootstrap/Spinner';
import Messages from '../Messages';
import * as utils from '../Common/utils';
import PropTypes from 'prop-types';
import ToolkitProvider, { CSVExport } from 'react-bootstrap-table2-toolkit';
import ReceiptModal from './ReceiptModal';

class OrderList extends React.Component {
  constructor(props, context) {
    super(props, context);
    const Config = require('../../config.json');
    const date = new Date();

    this.setStartDate = this.setStartDate.bind(this);
    this.setEndDate = this.setEndDate.bind(this);
    this.orderQueue = this.orderQueue.bind(this);
    this.showOrderDiv = this.showOrderDiv.bind(this);
    this.orderQueue = this.orderQueue.bind(this);
    this.processReport = this.processReport.bind(this);
    this.closeReceipt = this.closeReceipt.bind(this);
    this.openReceipt = this.openReceipt.bind(this);

    this.state = {
      Config,
      API: Config.apiAddress,
      startDate: new Date(date.getTime() - (7 * 24 * 60 * 60 * 1000)),
      endDate: date,
      indOrders: [],
      groupOrders: [],
      hasResults: false,
      processing: false,
      message: '',
      receiptGUID: '',
      receiptShow: false,
    };
  }

  // eslint-disable-next-line react/sort-comp
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

  setStartDate(date) {
    this.setState({
      startDate: date,
    });
  }


  setEndDate(date) {
    this.setState({
      endDate: date,
    });
  }

  processReport() {
    if (!this.state.startDate) {
      this.setState({
        message: 'Please set a starting date',
      });
      return false;
    }
    if (!this.state.endDate) {
      this.setState({
        message: 'Please set an ending date',
      });
      return false;
    }
    this.setState({
      processing: true,
    });

    const confirm = {
      f: 'orderSearch',
      sessionID: this.props.sessionID,
      startDate: this.state.startDate,
      endDate: this.state.endDate,
    };

    utils.ApiPostRequest(this.state.API + 'auth', confirm).then((data) => {
      if (data) {
        this.setState({
          indOrders: data.indOrders,
          groupOrders: data.groupOrders,
        });
      } else {
        this.setState({
          message: 'No records found',
        });
      }
    });
    this.setState({
      processing: false,
      hasResults: true,
    });

    return false;
  }

  orderQueue(orders) {
    if (orders && orders.length > 0) {
      const headerSortingStyle = { backgroundColor: '#c8e6c9' };
      const data = [];
      const { ExportCSVButton } = CSVExport;

      const columns = [{
        dataField: 'id',
        text: 'GUID',
        hidden: true,
        csvExport: false,
      }, {
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
        csvExport: false,
        headerStyle: {
          backgroundColor: '#FFFFFF',
          fontFamily: 'Trade Gothic Bold Condensed',
          color: '#0E2244',
        },
      }, {
        dataField: 'link',
        text: 'Receipt',
        hidden: true,
      }];

      orders.map((entry) => {
        data.push({
          id: entry.checkGUID,
          location: entry.company,
          ordered: entry.orderDate,
          delivered: entry.dateDue,
          print: this.showOrderDiv(entry),
          link: 'https://www.pbkminibar.com/receipt/' + entry.checkGUID,
        });
      });
      const defaultSorted = [{
        dataField: 'delivered',
        order: 'desc',
      }];

      return (
        <ToolkitProvider
          keyField="id"
          data={data}
          columns={columns}
          exportCSV>
          {
            props => (
              <div>
                <ExportCSVButton {...props.csvProps}>Export CSV</ExportCSVButton>
                <hr />
                <BootstrapTable {...props.baseProps} pagination={paginationFactory()} bordered={false} defaultSorted={defaultSorted} striped hover condensed />
              </div>
            )
          }
        </ToolkitProvider>);
    }
    return (<div className="text-muted">There are no orders yet.</div>);
  }

  render() {
    if (this.state.processing) {
      return (
        <Container>
          <Spinner animation="border" role="status">
            <span className="sr-only">Processing...</span>
          </Spinner>
        </Container>
      );
    }
    return (
      <Container fluid style={{ padding: '1em' }}>
        <ReceiptModal receiptGUID={this.state.receiptGUID} receiptShow={this.state.receiptShow} closeReceipt={this.closeReceipt} />
        {this.state.message ? (<Messages variantClass={'danger'} alertMessage={this.state.message} />) : (<></>)}
        <Row>
          <Form>
            <Form.Row>
              <Form.Group as={Col} controlId="startDate">
                <Form.Label><strong>Starting Date</strong></Form.Label>
                <DatePicker
                  selected={this.state.startDate}
                  onChange={date => this.setStartDate(date)}
                  selectsStart
                  className={'form-control'}
                  startDate={this.state.startDate}
                  endDate={this.state.endDate} />
              </Form.Group>
              <Form.Group as={Col} controlId="endDate">
                <Form.Label><strong>Ending Date</strong></Form.Label>
                <DatePicker
                  selected={this.state.endDate}
                  onChange={date => this.setEndDate(date)}
                  selectsEnd
                  className={'form-control'}
                  maxDate={new Date()}
                  startDate={this.state.startDate}
                  endDate={this.state.endDate}
                  minDate={this.state.startDate} />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Button variant={'brand'} onClick={this.processReport}>Search</Button>
            </Form.Row>
          </Form>
        </Row>
        {this.state.hasResults ? (
          <Row>
            <Col style={{ width: '50%' }}>
              <Row>
                <h3>Individual Minibar Orders</h3>
              </Row>
              <Row>
                <div style={{ width: '95%' }}>
                  {this.orderQueue(this.state.indOrders)}
                </div>
              </Row>
            </Col>
            <Col style={{ width: '50%' }}>
              <Row>
                <h3>Group Minibar Orders</h3>
              </Row>
              <Row>
                <div style={{ width: '95%' }}>
                  {this.orderQueue(this.state.groupOrders)}
                </div>
              </Row>
            </Col>
          </Row>) : (<div><strong>Please search for records</strong></div>)
        }
      </Container>
    );
  }
}

OrderList.propTypes = {
  sessionID: PropTypes.string,
};

export default OrderList;
