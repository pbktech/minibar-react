import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import PropTypes from 'prop-types';
import * as utils from './Common/utils';
import { CartCss } from './Common/utils';
import { connect } from 'react-redux';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      order: { checks: [] },
    };
  }

  componentDidMount() {
    let confirm = {};

    if (this.props.match && this.props.match.params.guid) {
      confirm = {
        f: 'receipt',
        guid: this.props.match.params.guid,
      };
    } else if (this.props.guid) {
      confirm = {
        f: 'receipt',
        guid: this.props.guid,
      };
    }
    if (confirm.f) {
      utils.ApiPostRequest(this.props.config.apiAddress + 'checkout', confirm).then((data) => {
        if (data) {
          this.setState({
            order: data,
          });
        } else {
          this.setState({
            error: 'Sorry, an unexpected error occurred',
            variantClass: 'danger',
          });
        }
      });
    }
  }

  componentDidUpdate(prevProps) {
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  render() {
    if (!this.state.order || this.state.order.checks === []) {
      return <><Alert variant={'warning'}>Your receipt was not found.</Alert></>;
    }

    return (
      <Container style={{ textAlign: 'center', paddingTop: '1em', fontFamily: 'Lora', paddingBottom: '2em', overflowY: 'auto', overflowX: 'hidden', height: '70vh' }}>
        <h2>Thank you for your order!</h2>
        <CartCss />
        <div className={'receipt'} style={{ textAlign: 'center', paddingTop: '1em', paddingBottom: '1em', margin: 'auto' }}>
          <Row style={{ paddingBottom: '1em' }}>
            <Col>
              <div><img src="/assets/images/receipt-logo_1519923720_400.png" alt="Protein Bar & Kitchen" /></div>
              {this.state.order.minibar
              && <div style={{ padding: '1em' }}>{'Delivery on ' + this.state.order.delivery}<br /><strong>{this.state.order.minibar}</strong></div>}

            </Col>
          </Row>
          {!!this.state.order.checks.length && this.state.order.checks.map((check) => {
            const total = parseFloat(check.totals.subtotal) + parseFloat(check.totals.tax);

            return (
              <Container fluid style={{   }}>
                <div className={'receipt-header'} />
                <Row className={'receipt-body'}>
                  <Col style={{ textAlign: 'left', fontWeight: 'bold' }}>
                    {check.tab + ' : ' + check.ordered}
                    <hr />
                  </Col>
                </Row>
                <Row className={'receipt-body'}>
                  <Col>
                    <div>
                      {!!check.items.length && check.items.map((item, ia) => {
                        return (
                          <>
                            <Row key={'cartItem_' + ia}>
                              <Col className="col-sm-9" key={ia} style={{ textAlign: 'left' }}>
                                <div style={{ fontSize: '125%' }}>{item.quantity} <span style={{ color: '#F36C21', fontWeight: 'bold' }}>{item.name}</span></div>
                                {item.mods.length > 0 ? (
                                  <>
                                    {item.mods.length && item.mods.filter((mod) => mod.guid === 'FOR').map((mod, m) => {
                                      return <div key={'mod_' + m} className="text-muted">{mod.name}</div>;
                                    })}
                                    <ul style={{ listStyleType: 'none', fontSize: '75%', fontStyle: 'italic' }}>
                                      {item.mods && item.mods.filter((mod) => mod.guid !== 'FOR').map((mod, m) => {
                                        return <li key={'mod_' + m} className="text-muted">{mod.name}</li>;
                                      })
                                      }
                                    </ul>
                                  </>
                                ) : (<></>)}
                              </Col>
                            </Row>
                            <div className={'receipt-footer'} />
                          </>);
                      })
                      }
                    </div>
                  </Col>
                </Row>
                <Row className={'receipt-body'} style={{ textAlign: 'right' }}>
                  <Col>
                    <hr />
                    <Row>
                      <Col className="col-sm-9">Subtotal:</Col><Col className="col-sm-3">${check.totals.subtotal}</Col>
                    </Row>
                    <Row>
                      <Col className="col-sm-9">Tax:</Col><Col className="col-sm-3">${check.totals.tax}</Col>
                    </Row>
                    <Row>
                      <Col className="col-sm-9">Total:</Col><Col className="col-sm-3">${total.toFixed(2)}</Col>
                    </Row>
                  </Col>
                </Row>
                {check.discounts.length > 0 ? (
                  <Row className={'receipt-body'} style={{ textAlign: 'right' }}>
                    <Col>
                      <hr />
                      {check.discounts.length && check.discounts.map((discount, d) =>
                        <>
                          <Row key={'discount_' + d}>
                            <Col className="col-sm-9">{discount.discountName} ({discount.promoCode})</Col><Col className="col-sm-3">${discount.discountAmount}</Col>
                          </Row>
                        </>
                      )}
                    </Col>
                  </Row>
                ) : (<></>)}
                {check.payments.length > 0 ? (
                  <Row className={'receipt-body'} style={{ textAlign: 'right' }}>
                    <Col>
                      <hr />
                      {check.payments.length && check.payments.map((payment, p) => {
                        return (
                          <Row key={'payment_' + p}>
                            <Col className="col-sm-9">{payment.paymentType + ' - ' + payment.cardNum.substring(payment.cardNum.length - 4)}</Col><Col className="col-sm-3">${payment.paymentAmount}</Col>
                          </Row>
                        );
                      })
                      }
                    </Col>
                  </Row>
                ) : (<></>)}
              </Container>
            );
          })
          }
        </div>
      </Container>
    );
  }
}

Home.propTypes = {
  locations: PropTypes.array.isRequired,
  config: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    locations: state.locations,
    config: state.config,
  };
};

export default connect(mapStateToProps, null)(Home);
