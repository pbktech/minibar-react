export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const SET_DELIVERY_DATE = 'SET_DELIVERY_DATE';
export const GET_DELIVERY_DATE = 'GET_DELIVERY_DATE';

export function addToCart(item) {
  return { type: ADD_TO_CART, item };
}

export function removeFromCart(id) {
  return { type: REMOVE_FROM_CART, id: id };
}

export function setDeliveryDate(info) {
  return { type: SET_DELIVERY_DATE, info };
}
export function getDeliveryDate(delivery) {
  return { type: GET_DELIVERY_DATE, delivery };
}
