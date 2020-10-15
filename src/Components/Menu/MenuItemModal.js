import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Tab from 'react-bootstrap/Tab'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Nav from 'react-bootstrap/Nav'
import 'react-web-tabs/dist/react-web-tabs.css';
import { connect } from 'react-redux';
import { addToCart } from '../../redux/actions/actions';
import { PlusSquare, DashSquare } from 'react-bootstrap-icons';
import { CartCss } from '../../utils';
import PropTypes from 'prop-types';
import Cookies from 'universal-cookie';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

class MenuItemModal extends React.Component {
  constructor(props) {
    super(props);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.IncrementItem = this.IncrementItem.bind(this);
    this.DecreaseItem = this.DecreaseItem.bind(this);
    this.ToggleClick = this.ToggleClick.bind(this);
    this.handleSR = this.handleSR.bind(this);

    const modState = {};

    this.props.modGroups
      .filter((itemMod) => itemMod.sort !== null)
      .sort((a, b) => (a.sort > b.sort ? 1 : -1))
      .map((entry) => {
        return (
          Object.keys(entry.mods).length && Object.keys(entry.mods).map((mod) => {
            const choice = entry.mods[mod];

            modState[choice.modifierGUID] = {
              checked: choice.isDefault === 1,
              defaultChecked: choice.isDefault,
              modifier: choice.modifier,
              guid: choice.modifierGUID,
              price: choice.price,
            };
            return '';
          })
        );
      });
    this.state = {
      show: false,
      quantity: 1,
      buttonDisabled: false,
      numChecked: 0,
      maxCheck: 0,
      item: { ...this.props },
      forName:'',
      specialRequest:'',
      modState,
    };
  }

  handleUpdate(e) {
    const modState = this.state.modState;

    if (!modState[e.target.dataset.name]) {
      modState[e.target.dataset.name] = {};
    }
  //  if(e.target.dataset.MaxSelections===1)
  this.props.modGroups
    .filter((itemMod) => itemMod.sort !== null)
    .sort((a, b) => (a.sort > b.sort ? 1 : -1))
    .map((entry) => {
        Object.keys(entry.mods).length && Object.keys(entry.mods).map((mod) => {
          const choice = entry.mods[mod];
          if(entry.modGroup.replaceAll(" ","_")===e.target.name && entry.maxSelections === 1){
            modState[choice.modifierGUID] = {
              checked: false,
              defaultChecked: choice.isDefault,
              modifier: choice.modifier,
              guid: choice.modifierGUID,
              price: choice.price,
            };
          }
        })
    });

    modState[e.target.dataset.guid].checked = e.target.checked;

    this.setState({
      modState,
    });
  }

  handleSR(e){
    if(e.target.name && e.target.name==='forName'){
      this.setState({
        forName:e.target.value,
      });
    }
    if(e.target.name && e.target.name==='specialRequest'){
      this.setState({
        specialRequest:e.target.value,
      });
    }
  }

  handleClose() {
    const modState = this.state.modState;
    this.props.modGroups
      .filter((itemMod) => itemMod.sort !== null)
      .sort((a, b) => (a.sort > b.sort ? 1 : -1))
      .map((entry) => {
        return (
          Object.keys(entry.mods).length && Object.keys(entry.mods).map((mod) => {
            const choice = entry.mods[mod];

            modState[choice.modifierGUID] = {
              checked: choice.isDefault === 1,
              defaultChecked: choice.isDefault,
              modifier: choice.modifier,
              guid: choice.modifierGUID,
              price: choice.price,
            };
            return '';
          })
        );
      });
    this.setState({
      show: false,
      forName:'',
      specialRequest:'',
      modState
     });
  }

  handleShow() {
    this.setState({ show: true });
  }

  IncrementItem() {
    this.setState({ quantity: this.state.quantity + 1 });
  }

  DecreaseItem() {
    if (this.state.quantity > 1) {
      this.setState({ quantity: this.state.quantity - 1 });
    }
  }

  ToggleClick() {
    this.setState({ show: !this.state.show });
  }
  render() {
    return (
      <div key={this.props.key}>
        <CartCss />
        {this.props.modGroups.length > 0 ? (
          <>
        <Button variant="brand" onClick={this.handleShow}>
          Customize
        </Button>
        <Modal show={this.state.show} onHide={this.handleClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title as="h2">{this.props.itemName}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Form noValidate validated={this.state.validated} onSubmit={this.handleForgot}>
            <Tab.Container defaultActiveKey="mod-tab-0">
              <Row>
                <Col sm={4}>
                  <Nav fill variant="pills" className="flex-column">
                {this.props.modGroups.length && this.props.modGroups
                  .filter((itemMod) => itemMod.sort !== null)
                  .sort((a, b) => {
                    if (a.sort === b.sort) {
                      return 0;
                    }
                    return a.sort > b.sort ? 1 : -1
                  })
                  .map((entry, i) => {
                    return (
                        <Nav.Item key={"navItem_"+i}>
                          <Nav.Link eventKey={"mod-tab-" + i} style={{textAlign:"left"}}>
                            <div key={'navTabdiv' + i} className="modTabHeader">
                              {entry.modGroup.toUpperCase()}
                            </div>
                            {entry.minSelections > 0 ? (
                              <div className="text-muted"><i>Required</i></div>
                            ) : (
                              <></>
                            )}
                          </Nav.Link>
                        </Nav.Item>
                    );
                  })}
                  <Nav.Item key={"navItem_request"}>
                    <Nav.Link eventKey={"mod-tab-request"} style={{textAlign:"left"}}>
                    <div key={'navTabdiv'} className="modTabHeader">Request</div>
                    </Nav.Link>
                  </Nav.Item>
                  </Nav>
                </Col>
              <Col sm={8}>
              <Tab.Content>
              {this.props.modGroups.length
                && this.props.modGroups
                  .filter((itemMod) => itemMod.sort !== null)
                  .sort((a, b)  => {
                    if (a.sort === b.sort) {
                      return 0;
                    }
                    return a.sort > b.sort ? 1 : -1
                  })
                  .map((entry, i) => {
                    const inputType = entry.maxSelections === 1 ? 'radio' : 'checkbox';
                    return (
                      <Tab.Pane eventKey={'mod-tab-' + i}>
                        <div key={'navTabPaneldiv' + i} className="modTabHeader">
                          {entry.maxSelections === null
                            ? "Choose as many as you'd like."
                            : 'Choose up to ' + entry.maxSelections + '.'}
                        </div>
                        {Object.keys(entry.mods).length
                          && Object.keys(entry.mods).map((mod, ia) => {
                            const choice = entry.mods[mod];
                            return (
                              <>
                                 <Form.Check type={inputType} id={choice.modifier.replaceAll(" ","_") + ia}>
                                  <Form.Check.Input
                                   type={inputType}
                                   name={entry.modGroup.replaceAll(" ","_")}
                                   data-name={choice.modifier}
                                   data-guid={choice.modifierGUID}
                                   data-price={choice.price}
                                   onChange={this.handleUpdate}
                                   defaultChecked={choice.isDefault}
                                   key={'modgroup-input-' + ia}
                                   checked={this.state[choice.modifierGUID] && this.state[choice.modifierGUID].checked} />
                                   <Form.Check.Label>{choice.modifier}</Form.Check.Label>
                                  {choice.price !== '0.00' ? (
                                    <div className="text-muted">
                                      <i>{'+' + choice.price}</i>
                                    </div>
                                  ) : (
                                    <></>
                                  )}
                                  </Form.Check>
                              </>
                            );
                          })}
                      </Tab.Pane>
                    );
                  })}
                    <Tab.Pane eventKey={'mod-tab-request'}>
                    <Form.Group controlId="formBasicEmail">
                      <Form.Label>Who is this for?</Form.Label>
                      <Form.Control type="text" name="forName" onChange={this.handleSR} />
                    </Form.Group>
                    <Form.Group controlId="formBasicEmail">
                      <Form.Label>Special Request</Form.Label>
                      <Form.Control type="text" name="specialRequest" maxlength="200" onChange={this.handleSR}/>
                    </Form.Group>
                    </Tab.Pane>
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Link to="#" onClick={this.DecreaseItem} disabled={this.state.buttonDisabled} variant="danger-outline">
              <DashSquare />
            </Link>
            <input name="quantity" value={this.state.quantity} className="form-control" style={{ width: '50px', textAlign: 'center' }} />
            <Link to="#" onClick={this.IncrementItem} variant="info-outline">
              <PlusSquare />
            </Link>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
            <Button
              variant="brand" onClick={() => {
                const selectedMods = [];
                const modArray = Object.keys(this.state.modState);

                for (let i = 0; i < modArray.length; i++) {
                  if (this.state.modState[modArray[i]].checked) {
                    selectedMods.push(this.state.modState[modArray[i]]);
                  }
                }
                this.props.addToCart({
                  name: this.props.itemName,
                  guid: this.props.itemGUID,
                  price: this.props.price,
                  quantity: this.state.quantity,
                  forName: this.state.forName,
                  specialRequest: this.state.specialRequest,
                  mods: selectedMods,
                });
                this.handleClose();
              }}>
              Add to Order
            </Button>
          </Modal.Footer>
        </Modal>
        </>
      ):(            <Button
                    variant="brand" onClick={() => {

                      this.props.addToCart({
                        name: this.props.itemName,
                        guid: this.props.itemGUID,
                        price: this.props.price,
                        quantity: this.state.quantity,
                      });
                    }}>
                    Add to Order
                  </Button>
)}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cart: state.cart,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addToCart: (item) => {
      dispatch(addToCart(item));
    },
  };
};

MenuItemModal.propTypes = {
  modGroups: PropTypes.array.isRequired,
  itemName: PropTypes.string.isRequired,
  addToCart: PropTypes.func.isRequired,
  guid: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(MenuItemModal);
