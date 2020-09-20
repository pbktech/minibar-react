import React from 'react';
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs';
import "react-web-tabs/dist/react-web-tabs.css";
import { connect } from 'react-redux';
import {addToCart, removeFromCart} from '../../redux/actions/actions';

class MenuItemModal extends React.Component {
  constructor(props) {
    super(props);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    let modState = {};
    this.props.modGroups.filter((itemMod) => itemMod.sort !== null).sort((a, b) => a.sort > b.sort).map((entry, i) => {
      Object.keys(entry.mods).length && Object.keys(entry.mods).map((mod, ia) => {
        let choice = entry.mods[mod];
        modState[choice.modifier] = {};
        modState[choice.modifier].checked = (choice.isDefault === 1);
      });
    });

    this.state = {
      show: false,
      quantity: 1,
      buttonDisabled: false,
      checked: false,
      item: {...this.props},
      modState
    };
  }

  handleClose() {
    this.setState({show: false});
  }

  handleShow() {
    this.setState({show: true});
  }

  IncrementItem = () => {
    this.setState({quantity: this.state.quantity + 1});
  }
  DecreaseItem = () => {
    if (this.state.quantity > 1) {
      this.setState({quantity: this.state.quantity - 1});
    }
  }
  ToggleClick = () => {
    this.setState({show: !this.state.show});
  }

  render() {
    return (
        <>
          <Button className="btn btn-brand" onClick={this.handleShow}>Add to order</Button>
          <Modal show={this.state.show} onHide={this.handleClose} size="lg">
            <Modal.Header closeButton>
              <Modal.Title as="h2">{this.props.itemName}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Tabs defaultTab="mod-tab-0" vertical className="vertical-tabs">
                <TabList>
                  {this.props.modGroups.length && this.props.modGroups.filter((itemMod) => itemMod.sort !== null).sort((a, b) => a.sort > b.sort).map((entry, i) => {
                    return (
                        <Tab key={"navTab" + i} tabFor={"mod-tab-" + i} style={{textAlign: "left"}}>
                          <div className="modTabHeader">{entry.modGroup}</div>
                          {
                            (entry.minSelections > 0) ? (<div className="card__subheading">Required</div>) : (<></>)
                          }
                        </Tab>
                    );
                  })
                  }
                </TabList>
                {this.props.modGroups.length && this.props.modGroups.filter((itemMod) => itemMod.sort !== null).sort((a, b) => a.sort > b.sort).map((entry, i) => {
                  let inputType = (entry.maxSelections === 1) ? ("radio") : ("checkbox")
                  return (
                      <TabPanel key={"navTabPanel" + i} tabId={"mod-tab-" + i} key={"mod-tab-" + i}>
                        <div className="modTabHeader">
                          {(entry.maxSelections === null) ? ("Choose as many as you'd like.") : ("Choose up to " + entry.maxSelections + ".")}
                        </div>
                        {Object.keys(entry.mods).length && Object.keys(entry.mods).map((mod, ia) => {
                          let choice = entry.mods[mod];
                          return (
                              <>
                                <div><input type={inputType} name="" id="" checked={this.state[choice.modifier] && this.state[choice.modifier].checked}/> {choice.modifier}
                                  {
                                    (choice.price !== "0.00") ?
                                        <span className="card__subheading">{"+" + choice.price}</span> : <></>
                                  }
                                </div>
                              </>
                          );
                        })
                        }
                      </TabPanel>
                  );
                })
                }
              </Tabs>
            </Modal.Body>
            <Modal.Footer>
              <button onClick={this.DecreaseItem} disabled={this.state.buttonDisabled} className="btn btn-brand">-
              </button>
              <input name="quantity" value={this.state.quantity} className="form-control" style={{width: "50px", textAlign: "center"}}/>
              <button onClick={this.IncrementItem} className="btn btn-brand">+</button>
              <Button variant="secondary" onClick={this.handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={(item) => {
                this.props.dispatch(addToCart({name: this.props.itemName, quantity: this.state.quantity, mods: this.state.modState}));
                this.handleClose();
              }}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cart: state.cart,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    addToCart: (item) => dispatch(addToCart(item)),
    removeFromCart: (item) => dispatch(removeFromCart(item)),
  }
}

export default connect(null, null)(MenuItemModal);
