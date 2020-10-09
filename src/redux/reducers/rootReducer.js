import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  SET_DELIVERY_DATE,
  SET_LOGIN_OBJECT,

} from '../actions/actions';
import { createAction, createReducer } from '@reduxjs/toolkit';

const initialState = {
  cart: [],
  delivery:{},
  loggedIn:{},
};
const addToCart = createAction(ADD_TO_CART);
const removeFromCart = createAction(REMOVE_FROM_CART);
const setDeliveryDate = createAction(SET_DELIVERY_DATE);
const setLoginObject = createAction(SET_LOGIN_OBJECT);

const rootReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(addToCart, (state, action) => {
      state.cart = [...state.cart, action.item];
    })
    .addCase(removeFromCart, (state, action) => {
      state.cart = state.cart.filter((item, index) => index !== action.id);
    })
    .addCase(setDeliveryDate, (state, action) => {
      state.delivery = {
        date: action.info.date,
        location: action.info.location,
        service: action.info.service,
        guid: action.info.guid,
      };
    })
    .addCase(setLoginObject, (state, action) => {
      state.loggedIn = {
        guestName: action.loggedIn.guestName,
        sessionID: action.loggedIn.sessionID,
      };
    });
});

export default rootReducer;
