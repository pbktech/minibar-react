import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  SET_DELIVERY_DATE,
  SET_LOGIN_OBJECT,
  SET_LOCATIONS,
  SET_HEADERID,

} from '../actions/actions';
import { createAction, createReducer } from '@reduxjs/toolkit';

const initialState = {
  cart: [],
  delivery:{},
  loggedIn:{ addresses:[]},
  storedlocations:[],
  headerID: '',
};
const addToCart = createAction(ADD_TO_CART);
const removeFromCart = createAction(REMOVE_FROM_CART);
const setDeliveryDate = createAction(SET_DELIVERY_DATE);
const setLoginObject = createAction(SET_LOGIN_OBJECT);
const setLocations = createAction(SET_LOCATIONS);
const setHeaderID = createAction(SET_HEADERID);

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
        ...action.info
      };
    })
    .addCase(setLocations, (state, action) => {
      state.storedlocations = action.storedlocations;
    })
    .addCase(setHeaderID, (state, action) => {
      state.headerID = action.headerID;
    })
    .addCase(setLoginObject, (state, action) => {
      state.loggedIn = {
        guestName: action.loggedIn.guestName,
        sessionID: action.loggedIn.sessionID,
        addresses: action.loggedIn.addresses,
        email: action.loggedIn.email,
        phone: action.loggedIn.phone,
      };
    });
});

export default rootReducer;
