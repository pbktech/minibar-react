import React from 'react';
import { PaymentInputsWrapper, usePaymentInputs } from 'react-payment-inputs';
import images from 'react-payment-inputs/images';
import {addToCart, removeFromCart} from "../redux/actions/actions";
import {connect} from "react-redux";
import Container from 'react-bootstrap/Container'
import Login from './Login.js'


export default function PaymentInputs() {
  const {
    wrapperProps,
    getCardImageProps,
    getCardNumberProps,
    getExpiryDateProps,
    getCVCProps
  } = usePaymentInputs();

  return (
    <Container style={{paddingTop:"1em"}}>
    <h2>Checkout</h2>
    <span>More things will go here</span><br/>
      <PaymentInputsWrapper {...wrapperProps}>
        <svg {...getCardImageProps({ images })} />
        <input {...getCardNumberProps()} />
        <input {...getExpiryDateProps()} />
        <input {...getCVCProps()} />
      </PaymentInputsWrapper>
    </Container>
  );
}
