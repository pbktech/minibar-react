import { ADD_TO_CART, REMOVE_FROM_CART, SET_DELIVERY_DATE, GET_DELIVERY_DATE } from '../actions/actions';
import { createAction, createReducer } from '@reduxjs/toolkit'

const initialState = {
  cart: [],
};
const addToCart = createAction(ADD_TO_CART)
const removeFromCart = createAction(REMOVE_FROM_CART);
const setDeliveryDate = createAction(SET_DELIVERY_DATE);
/*const getDeliveryDate = createAction(GET_DELIVERY_DATE);*/

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
      .addCase(setDeliveryDate, (state, action) => {
        state.delivery = {
          date: action.info.date,
          location: action.info.location,
          service: action.info.service,
          guid: action.info.guid
        }
      })
      /*.addCase(getDeliveryDate, (state, action) => {
        return this.state.delivery
      })*/
});

export default rootReducer;
