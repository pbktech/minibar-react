import { ADD_TO_CART, REMOVE_FROM_CART } from '../actions/actions';

const initialState = {
  cart: [],
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_TO_CART:
      return {
        cart: [
          ...state.cart,
          action.item,
        ],
      };
    case REMOVE_FROM_CART:
      console.log("removing from cart");
      console.log(action.item);
      return {
        cart: state.cart.filter((item, index) => index != action.id),
      };

    default:
      return state;
  }
}

export default rootReducer;
