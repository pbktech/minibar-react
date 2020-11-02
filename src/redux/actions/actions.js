export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const SET_DELIVERY_DATE = 'SET_DELIVERY_DATE';
export const GET_DELIVERY_DATE = 'GET_DELIVERY_DATE';
export const SET_LOGIN_OBJECT = 'SET_LOGIN_OBJECT';
export const SET_LOCATIONS = 'SET_LOCATIONS';
export const SET_HEADERID = 'SET_HEADERID';
export const SET_CONFIG = 'SET_CONFIG';
export const REMOVE_ADDRESS = 'REMOVE_ADDRESS';

export const addToCart = (item) => {
  return { type: ADD_TO_CART, item };
};

export const removeFromCart = (id) => {
  return { type: REMOVE_FROM_CART, id };
};

export const removeAddress = (id) => {
  return { type: REMOVE_ADDRESS, id };
};

export const setDeliveryDate = (info) => {
  return { type: SET_DELIVERY_DATE, info };
};

export const getDeliveryDate = (delivery) => {
  return { type: GET_DELIVERY_DATE, delivery };
};

export const setLoginObject = (loggedIn) => {
  return { type: SET_LOGIN_OBJECT, loggedIn };
};

export const setLocations = (locations) => {
  return { type: SET_LOCATIONS, locations };
};

export const setHeaderID = (headerID) => {
  return { type: SET_HEADERID, headerID };
};

export const setConfig = (config) => {
  return { type: SET_CONFIG, config };
};
