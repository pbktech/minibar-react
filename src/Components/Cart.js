import React from 'react';

import {connect} from "react-redux";

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
        return <li key={i}>{item.itemName}: {item.itemQuantity}</li>;
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