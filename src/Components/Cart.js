import React from 'react';

import {connect} from "react-redux";
import {addToCart, removeFromCart} from "../redux/actions/actions";

class Cart extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (<div>
      Cart Contents:
      <ul>
      {
        this.props && this.props.cart.map((item, i) => {
          return <li key={i}>{item.name}: {item.quantity}, mods:
          {
            Object.keys(item.mods).filter((mod) => item.mods[mod].checked === true).map(mod => mod + ', ')
          } <button data-index={i} onClick={(event) => {this.props.dispatch(removeFromCart(event.target.dataset.index));}}>X</button></li>;
        })
      }
      </ul>
    </div>);
  }
}

const mapState = (state) => {
  return {
    cart: state.cart,
  };
}

export default connect(mapState, null)(Cart);