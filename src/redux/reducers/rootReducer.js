import { ADD_TO_CART, REMOVE_FROM_CART } from '../actions/actions';
import { createAction, createReducer } from '@reduxjs/toolkit'

const initialState = {
  cart: [],
};
const addToCart = createAction(ADD_TO_CART)
const removeFromCart = createAction(REMOVE_FROM_CART);
const incrementByAmount = createAction('counter/incrementByAmount')

const rootReducer = createReducer(initialState, (builder) => {
  builder
      .addCase(addToCart, (state, action) => {
        state.cart = [
          ...state.cart,
          action.item,
        ]
      })
      .addCase(removeFromCart, (state, action) => {
        state.cart = state.cart.filter((item, index) => index != action.id)
      })
});

export default rootReducer;
