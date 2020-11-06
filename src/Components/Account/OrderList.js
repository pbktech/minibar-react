import React from 'react';
import { connect } from 'react-redux';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import { Printer, Receipt } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

class OrderList extends React.Component {
  constructor(props, context) {
    super(props, context);
    const Config = require('../../config.json');
    this.state = {
      Config,
      API: Config.apiAddress
    };
    this.showOrderDiv = this.showOrderDiv.bind(this);
    this.orderQueue = this.orderQueue.bind(this);
  }

  showOrderDiv(entry) {
    return (
      <ButtonToolbar>
        <ButtonGroup>
          <Button variant={'link'} data-guid={entry.checkGUID} onClick={this.openReceipt}><Receipt size={18} data-guid={entry.checkGUID}/></Button>
          <Link to={'/receipt/' + entry.checkGUID + '?print=true'} target="_blank"><Button variant={'link'}><Printer size={18}/></Button></Link>
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
          color: '#0E2244'
        }
      }, {
        dataField: 'ordered',
        text: 'Date Ordered',
        sort: true,
        headerSortingStyle,
        headerStyle: {
          backgroundColor: '#FFFFFF',
          fontFamily: 'Trade Gothic Bold Condensed',
          color: '#0E2244'
        }
      }, {
        dataField: 'delivered',
        text: 'Date Delivered',
        sort: true,
        headerSortingStyle,
        headerStyle: {
          backgroundColor: '#FFFFFF',
          fontFamily: 'Trade Gothic Bold Condensed',
          color: '#0E2244'
        }
      }, {
        dataField: 'print',
        text: 'Actions',
        headerStyle: {
          backgroundColor: '#FFFFFF',
          fontFamily: 'Trade Gothic Bold Condensed',
          color: '#0E2244'
        }
      }];
      orders.map((entry, i) => {
        data.push({
          location: entry.company,
          ordered: entry.orderDate,
          delivered: entry.dateDue,
          print: this.showOrderDiv(entry)
        });
      });
      const defaultSorted = [{
        dataField: 'delivered',
        order: 'desc'
      }];
      return <BootstrapTable keyField='id' data={data} columns={columns} pagination={paginationFactory()} headerClasses="h4" bordered={false} defaultSorted={defaultSorted} striped hover condensed/>;
    } else {
      return (<div className="text-muted">There are no orders yet.</div>);
    }
  }

  render() {
    return (
      <div>Lists of orders go here.</div>
    );
  }
}

export default OrderList;
