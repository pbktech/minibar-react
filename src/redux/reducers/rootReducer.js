import { ADD_TO_CART, REMOVE_FROM_CART, SET_CONFIG, SET_DELIVERY_DATE, SET_HEADERID, SET_LOCATIONS, SET_LOGIN_OBJECT, REMOVE_ADDRESS } from '../actions/actions';
import { createAction, createReducer } from '@reduxjs/toolkit';

const initialState = {
  cart: [],
  delivery: {},
  locations: [],
  loggedIn: { addresses: [], orders: [], groupOrders: [], groupLinks: [] },
  storedlocations: [],
  headerID: '',
  config: {},
};

const addToCart = createAction(ADD_TO_CART);
const removeFromCart = createAction(REMOVE_FROM_CART);
const setDeliveryDate = createAction(SET_DELIVERY_DATE);
const setLoginObject = createAction(SET_LOGIN_OBJECT);
const setLocations = createAction(SET_LOCATIONS);
const setHeaderID = createAction(SET_HEADERID);
const setConfig = createAction(SET_CONFIG);
const removeAddress = createAction(REMOVE_ADDRESS);

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
        ...action.info,
      };
    })
    .addCase(setLocations, (state, action) => {
      state.locations = action.locations;
    })
    .addCase(setHeaderID, (state, action) => {
      state.headerID = action.headerID;
    })
    .addCase(setConfig, (state, action) => {
      state.config = action.config;
    })
    .addCase(removeAddress, (state, action) => {
      state.loggedIn.addresses = state.loggedIn.addresses.filter((item, index) => index !== action.id);
    })
    .addCase(setLoginObject, (state, action) => {
      state.loggedIn = {
        guestName: action.loggedIn.guestName,
        sessionID: action.loggedIn.sessionID,
        addresses: action.loggedIn.addresses,
        email: action.loggedIn.email,
        phone: action.loggedIn.phone,
        orders: action.loggedIn.orders,
        groupOrders: action.loggedIn.groupOrders,
        groupLinks: action.loggedIn.groupLinks,
      };
    });
});

export default rootReducer;
