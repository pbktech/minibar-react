import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs';
import 'react-web-tabs/dist/react-web-tabs.css';
import { connect } from 'react-redux';
import { addToCart } from '../../redux/actions/actions';
import { PlusSquare, DashSquare } from 'react-bootstrap-icons';
import { CartCss } from '../../utils';
import PropTypes from 'prop-types';
import Cookies from 'universal-cookie';

class MenuItemModal extends React.Component {
  constructor(props) {
    super(props);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.IncrementItem = this.IncrementItem.bind(this);
    this.DecreaseItem = this.DecreaseItem.bind(this);
    this.ToggleClick = this.ToggleClick.bind(this);

    const modState = {};

    this.props.modGroups
      .filter((itemMod) => itemMod.sort !== null)
      .sort((a, b) => (a.sort > b.sort ? 1 : -1))
      .map((entry) => {
        return (
          Object.keys(entry.mods).length && Object.keys(entry.mods).map((mod) => {
            const choice = entry.mods[mod];

            modState[choice.modifier] = {
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
      modState,
    };
  }

  handleUpdate(e) {
    const modState = this.state.modState;

    if (!modState[e.target.dataset.name]) {
      modState[e.target.dataset.name] = {};
    }

    modState[e.target.dataset.name].checked = e.target.checked;

    this.setState({
      modState,
    });
  }

  handleClose() {
    this.setState({ show: false });
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
      <>
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
            <Tabs defaultTab="mod-tab-0" vertical className="vertical-tabs">
              <TabList>
                {this.props.modGroups.length && this.props.modGroups
                  .filter((itemMod) => itemMod.sort !== null)
                  .sort((a, b) => a.sort > b.sort ? 1 : -1)
                  .map((entry, i) => {
                    return (
                      <Tab key={'navTab' + i} tabFor={'mod-tab-' + i} style={{ textAlign: 'left' }}>
                        <div key={'navTabdiv' + i} className="modTabHeader">
                          {entry.modGroup.toUpperCase()}
                        </div>
                        {entry.minSelections > 0 ? (
                          <div className="card__subheading">Required</div>
                        ) : (
                          <></>
                        )}
                      </Tab>
                    );
                  })}
              </TabList>
              {this.props.modGroups.length
                && this.props.modGroups
                  .filter((itemMod) => itemMod.sort !== null)
                  .sort((a, b) => a.sort > b.sort)
                  .map((entry, i) => {
                    const inputType = entry.maxSelections === 1 ? 'radio' : 'checkbox';

                    return (
                      <TabPanel key={'navTabPanel' + i} tabId={'mod-tab-' + i}>
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
                                <div key={'modgroup' + ia}>
                                  <input
                                   type={inputType}
                                   name={entry.modGroup.replaceAll(" ","_")}
                                   data-name={choice.modifier}
                                   data-guid={choice.modifierGUID}
                                   data-price={choice.price}
                                   onChange={this.handleUpdate}
                                   defaultChecked={choice.isDefault}
                                   key={'modgroup-input-' + ia}
                                   checked={this.state[choice.modifier] && this.state[choice.modifier].checked} />{' '}
                                  {choice.modifier}
                                  {choice.price !== '0.00' ? (
                                    <span className="card__subheading">
                                      {'+' + choice.price}
                                    </span>
                                  ) : (
                                    <></>
                                  )}
                                </div>
                              </>
                            );
                          })}
                      </TabPanel>
                    );
                  })}
            </Tabs>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.DecreaseItem} disabled={this.state.buttonDisabled} variant="danger">
              <DashSquare />
            </Button>
            <input name="quantity" value={this.state.quantity} className="form-control" style={{ width: '50px', textAlign: 'center' }} />
            <Button onClick={this.IncrementItem} variant="info">
              <PlusSquare />
            </Button>
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
      </>
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
