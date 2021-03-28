import React from 'react';
import { addToCart, removeFromCart, setDeliveryDate, setLoginObject } from '../../redux/actions/actions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { XCircle } from 'react-bootstrap-icons';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import MenuItemModal from '../Menu/MenuItemModal';

class Suggest extends React.Component {
  constructor(props, context) {
    super(props, context);
    const Config = require('../../config.json');

    this.state = {
      Config,
      API: Config.apiAddress,
      suggestedItems: [],
      suggestedGUIDS: [],
      shown: false,
      show: false,
    };

    this.checkInCart = this.checkInCart.bind(this);
    this.selectItems = this.selectItems.bind(this);
    this.shuffle = this.shuffle.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  componentDidMount() {
    this.selectItems();
  }

  checkInCart(item) {
    if (this.props.cart && this.props.cart.items && this.props.cart.items.length) {
      this.props.cart.items.map((entry) => {
        const guid = entry.guid.split('/');

        if (item === guid[1]) {
          return true;
        }
      });
    }
    return false;
  }

  selectItems() {
    const suggestedItems = [];
    const suggestedGUIDS = [];

    if (this.props.delivery && this.props.delivery.suggested && this.props.delivery.suggested.length) {
      this.props.delivery.suggested.map((group) => {
        for (let i = 0; i < 2; i = i + 1) {
          const key = Math.floor(Math.random() * group.items.length);

          const item = group.items[key];

          if (!this.checkInCart(item.guid) && !this.state.suggestedGUIDS.includes(item.guid)) {
            suggestedItems.push({ item });
            suggestedGUIDS.push(item.guid);
          } else {
            i = i - 1;
          }
        }
      });
    }

    this.setState({
      suggestedItems,
      suggestedGUIDS,
      show: true,
    });
  }

  shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  hideModal() {
    this.setState({
      shown: true,
      show: false,
    });
    if (this.props.checkPrices){
      this.props.checkPrices();
    }
  }

  render() {
    const items = this.shuffle(this.state.suggestedItems);

    return (
      <Modal show={this.state.show} size={'xl'}>
        <Modal.Header><h2>Would you like to add something else?</h2></Modal.Header>
        <Modal.Body>
          <Container fluid>
            {items.length && items.map((item, i) =>{
              return (
                <div key={'itemCards' + i} className="col-sm-3">
                  <Card key={'itemCard' + i}>
                    <Card.Img variant="top" src={item.item.image} key={'itemCardImage' + i} />
                    <Card.Body>
                      <Card.Title><h3>{item.item.name}</h3></Card.Title>
                      <Card.Subtitle>{item.item.price}</Card.Subtitle>
                    </Card.Body>
                    <Card.Footer style={{ backgroundColor: '#FFFFFF', textAlign: 'center' }}>
                      <Button
                        variant="brand" onClick={() => {
                          // eslint-disable-next-line react/prop-types
                          this.props.addToCart({
                            name: item.item.name,
                            guid: item.item.menuGroupGUID + '/' + item.item.menuItemGUID,
                            price: item.item.price,
                            quantity: 1,
                          });
                        }}>
                        Add to Order
                      </Button>
                    </Card.Footer>
                  </Card>
                </div>);
            })
            }
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={this.hideModal}>
            <XCircle size={32} />
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

const mapState = (state) => {
  return {
    cart: state.cart,
    delivery: state.delivery,
    loggedIn: state.loggedIn,
    headerID: state.headerID,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setDeliveryDate: (delivery) => {
      dispatch(setDeliveryDate(delivery));
    },
    setLoginObject: (loggedIn) => {
      dispatch(setLoginObject(loggedIn));
    },
    removeFromCart: (item) => {
      dispatch(removeFromCart(item));
    },
    addToCart: (item) => {
      dispatch(addToCart(item));
    },
  };
};

Suggest.propTypes = {
  cart: PropTypes.array.isRequired,
  delivery: PropTypes.object.isRequired,
  loggedIn: PropTypes.object.isRequired,
};

export default connect(mapState, mapDispatchToProps)(Suggest);
