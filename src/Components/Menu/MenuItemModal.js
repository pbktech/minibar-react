import React from 'react';
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs';
import "react-web-tabs/dist/react-web-tabs.css";
import { connect } from 'react-redux';
import {addToCart, removeFromCart} from '../../redux/actions/actions';
import { PlusSquare, DashSquare } from 'react-bootstrap-icons';

class MenuItemModal extends React.Component {
  constructor(props) {
    super(props);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.IncrementItem = this.IncrementItem.bind(this);
    this.DecreaseItem = this.DecreaseItem.bind(this);
    this.ToggleClick = this.ToggleClick.bind(this);

    let modState = {};
    this.props.modGroups.filter(itemMod => itemMod.sort !== null).sort((a, b) => a.sort > b.sort ? 1 : -1).map((entry, i) => {
      return Object.keys(entry.mods).length && Object.keys(entry.mods).map((mod, ia) => {
        let choice = entry.mods[mod];
        modState[choice.modifier] = {
          checked: (choice.isDefault === 1),
          defaultChecked: choice.isDefault,
          modifier: choice.modifier,
          guid: choice.modifierGUID,
          price: choice.price
        };
        return '';
      });
    });

    this.state = {
      show: false,
      quantity: 1,
      buttonDisabled: false,
      numChecked:0,
      maxCheck:0,
      item: {...this.props},
      modState
    };
  }

  handleUpdate(e) {
    let modState = this.state.modState;
    if (!modState[e.target.dataset.name]) {
      modState[e.target.dataset.name] = {};
    }

    modState[e.target.dataset.name].checked = e.target.checked;

   this.setState({
      modState: modState
    })
  }

  handleClose() {
    this.setState({show: false});
  }

  handleShow() {
    this.setState({show: true});
  }

  IncrementItem() {
    this.setState({quantity: this.state.quantity + 1});
  }
  DecreaseItem() {
    if (this.state.quantity > 1) {
      this.setState({quantity: this.state.quantity - 1});
    }
  }
  ToggleClick() {
    this.setState({show: !this.state.show});
  }

  render() {
    return (
        <>
          <style type="text/css">
            {`
              .btn-brand {
    font-family: "Gotham Black" !important;
    color: #fff !important;
    background-color: #b2d235 !important;
    border-color: #b2d235 !important;
}
.btn-brand:hover {
    color: #fff;
    background-color: #00bdd0;
    border-color: #00bdd0;
}
.btn-brand:focus,
.btn-brand.focus {
    color: #fff;
    background-color: #00bdd0;
    border-color: #00bdd0;
}
.btn-brand:active,
.btn-brand.active,
.open > .btn-brand.dropdown-toggle {
    color: #fff;
    background-color: #00bdd0;
    border-color: #00bdd0;
    background-image: none;
}
.btn-brand:active:hover,
.btn-brand:active:focus,
.btn-brand:active.focus,
.btn-brand.active:hover,
.btn-brand.active:focus,
.btn-brand.active.focus,
.open > .btn-brand.dropdown-toggle:hover,
.open > .btn-brand.dropdown-toggle:focus,
.open > .btn-brand.dropdown-toggle.focus {
    color: #fff;
    background-color: #00a6b7;
    border-color: #00a6b7;
}
.btn-brand.disabled:focus,
.btn-brand.disabled.focus,
.btn-brand:disabled:focus,
.btn-brand:disabled.focus {
    background-color: #b2d235;
    border-color: #b2d235;
}
.btn-brand.disabled:hover,
.btn-brand:disabled:hover {
    background-color: #b2d235;
    border-color: #b2d235;
}
.btn-brand-inverted {
    font-family: "Gotham Black";
    color: #b2d235;
    background-color: #fff;
    border-color: #b2d235;
}
.btn-brand-inverted:hover {
    color: #fff;
    background-color: #00bdd0;
    border-color: #00bdd0;
}
.btn-brand-inverted:focus,
.btn-brand-inverted.focus {
    color: #fff;
    background-color: #00bdd0;
    border-color: #00bdd0;
}
.btn-brand-inverted:active,
.btn-brand-inverted.active,
.open > .btn-brand-inverted.dropdown-toggle {
    color: #fff;
    background-color: #00bdd0;
    border-color: #00bdd0;
    background-image: none;
}
.btn-brand-inverted:active:hover,
.btn-brand-inverted:active:focus,
.btn-brand-inverted:active.focus,
.btn-brand-inverted.active:hover,
.btn-brand-inverted.active:focus,
.btn-brand-inverted.active.focus,
.open > .btn-brand-inverted.dropdown-toggle:hover,
.open > .btn-brand-inverted.dropdown-toggle:focus,
.open > .btn-brand-inverted.dropdown-toggle.focus {
    color: #fff;
    background-color: #00a6b7;
    border-color: #00a6b7;
}
.btn-brand-inverted.disabled:focus,
.btn-brand-inverted.disabled.focus,
.btn-brand-inverted:disabled:focus,
.btn-brand-inverted:disabled.focus {
    background-color: #fff;
    border-color: #b2d235;
}
.btn-brand-inverted.disabled:hover,
.btn-brand-inverted:disabled:hover {
    background-color: #fff;
    border-color: #b2d235;
}
.btn-brand-alt {
    font-family: "Gotham Black";
    color: #fff;
    background-color: #00bdd0;
    border-color: #00bdd0;
}
.btn-brand-alt:hover {
    color: #fff;
    background-color: #b2d235;
    border-color: #b2d235;
}
.btn-brand-alt:focus,
.btn-brand-alt.focus {
    color: #fff;
    background-color: #b2d235;
    border-color: #b2d235;
}
.btn-brand-alt:active,
.btn-brand-alt.active,
.open > .btn-brand-alt.dropdown-toggle {
    color: #fff;
    background-color: #b2d235;
    border-color: #b2d235;
    background-image: none;
}
.btn-brand-alt:active:hover,
.btn-brand-alt:active:focus,
.btn-brand-alt:active.focus,
.btn-brand-alt.active:hover,
.btn-brand-alt.active:focus,
.btn-brand-alt.active.focus,
.open > .btn-brand-alt.dropdown-toggle:hover,
.open > .btn-brand-alt.dropdown-toggle:focus,
.open > .btn-brand-alt.dropdown-toggle.focus {
    color: #fff;
    background-color: #a3c22b;
    border-color: #a3c22b;
}
.btn-brand-alt.disabled:focus,
.btn-brand-alt.disabled.focus,
.btn-brand-alt:disabled:focus,
.btn-brand-alt:disabled.focus {
    background-color: #00bdd0;
    border-color: #00bdd0;
}
.btn-brand-alt.disabled:hover,
.btn-brand-alt:disabled:hover {
    background-color: #00bdd0;
    border-color: #00bdd0;
}
.btn-tabs {
    font-family: "Gotham Black";
    color: #fff;
    background-color: #00bdd0;
    border-color: #00bdd0;
}
.btn-tabs:hover {
    color: #fff;
    background-color: #b2d235;
    border-color: #b2d235;
}
.btn-tabs:focus,
.btn-tabs.focus {
    color: #fff;
    background-color: #b2d235;
    border-color: #b2d235;
}
.btn-tabs:active,
.btn-tabs.active,
.open > .btn-tabs.dropdown-toggle {
    color: #fff;
    background-color: #b2d235;
    border-color: #b2d235;
    background-image: none;
}
.btn-tabs:active:hover,
.btn-tabs:active:focus,
.btn-tabs:active.focus,
.btn-tabs.active:hover,
.btn-tabs.active:focus,
.btn-tabs.active.focus,
.open > .btn-tabs.dropdown-toggle:hover,
.open > .btn-tabs.dropdown-toggle:focus,
.open > .btn-tabs.dropdown-toggle.focus {
    color: #fff;
    background-color: #a3c22b;
    border-color: #a3c22b;
}
.btn-tabs.disabled:focus,
.btn-tabs.disabled.focus,
.btn-tabs:disabled:focus,
.btn-tabs:disabled.focus {
    background-color: #00bdd0;
    border-color: #00bdd0;
}
.btn-tabs.disabled:hover,
.btn-tabs:disabled:hover {
    background-color: #00bdd0;
    border-color: #00bdd0;
}
.btn-cart {
    font-family: "Gotham Black";
    font-size: 0.75rem;
    text-transform: none;
    padding: 0.3em 1.1em;
    color: #fff;
    background-color: #b2d235;
    border-color: #b2d235;
}
.btn-cart:before {
    display: inline-block;
    font: normal normal normal 14px/1 FontAwesome;
    font-size: inherit;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    content: "";
    margin-right: 0.5em;
}
.btn-cart:after {
    content: " " attr(data-cart-label);
}
.btn-cart:hover {
    color: #fff;
    background-color: #00bdd0;
    border-color: #00bdd0;
}
.btn-cart:focus,
.btn-cart.focus {
    color: #fff;
    background-color: #00bdd0;
    border-color: #00bdd0;
}
.btn-cart:active,
.btn-cart.active,
.open > .btn-cart.dropdown-toggle {
    color: #fff;
    background-color: #00bdd0;
    border-color: #00bdd0;
    background-image: none;
}
.btn-cart:active:hover,
.btn-cart:active:focus,
.btn-cart:active.focus,
.btn-cart.active:hover,
.btn-cart.active:focus,
.btn-cart.active.focus,
.open > .btn-cart.dropdown-toggle:hover,
.open > .btn-cart.dropdown-toggle:focus,
.open > .btn-cart.dropdown-toggle.focus {
    color: #fff;
    background-color: #00a6b7;
    border-color: #00a6b7;
}
.btn-cart.disabled:focus,
.btn-cart.disabled.focus,
.btn-cart:disabled:focus,
.btn-cart:disabled.focus {
    background-color: #b2d235;
    border-color: #b2d235;
}
.btn-cart.disabled:hover,
.btn-cart:disabled:hover {
    background-color: #b2d235;
    border-color: #b2d235;
}
.btn-cart--empty {
    display: none !important;
}
.btn-block {
    padding-left: 0.9375rem;
    padding-right: 0.9375rem;
}
            `}
          </style>
          <Button variant="brand" onClick={this.handleShow}>Add to order</Button>
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
                          <div key={"navTabdiv" + i} className="modTabHeader">{entry.modGroup}</div>
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
                      <TabPanel key={"navTabPanel" + i} tabId={"mod-tab-" + i} >
                        <div key={"navTabPaneldiv" + i} className="modTabHeader">
                          {(entry.maxSelections === null) ? ("Choose as many as you'd like.") : ("Choose up to " + entry.maxSelections + ".")}
                        </div>
                        {Object.keys(entry.mods).length && Object.keys(entry.mods).map((mod, ia) => {
                          let choice = entry.mods[mod];
                          return (
                              <>
                                <div key={"modgroup"+ia}><input
                                  type={inputType}
                                  data-name={choice.modifier}
                                  data-guid={choice.modifierGUID}
                                  data-price={choice.price}
                                  onChange={this.handleUpdate}
                                  defaultChecked={choice.isDefault}
                                  checked={this.state[choice.modifier] && this.state[choice.modifier].checked}/> {choice.modifier}
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
              <Button onClick={this.DecreaseItem} disabled={this.state.buttonDisabled} variant="danger"><DashSquare />
              </Button>
              <input name="quantity" value={this.state.quantity} className="form-control" style={{width: "50px", textAlign: "center"}}/>
              <Button onClick={this.IncrementItem} variant="info"><PlusSquare /></Button>
              <Button variant="secondary" onClick={this.handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={(item) => {
                let selectedMods = [];
                const modArray = Object.keys(this.state.modState);
                for (let i = 0; i < modArray.length; i++) {
                  if (this.state.modState[modArray[i]].checked) {
                    selectedMods.push(this.state.modState[modArray[i]]);
                  }
                }
                this.props.dispatch(addToCart({name: this.props.itemName, guid: this.props.guid, price: this.props.price, quantity: this.state.quantity, mods: selectedMods}));
                this.handleClose();
              }}>
                Add to Cart
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

export default connect(mapStateToProps, mapDispatchToProps)(MenuItemModal);
