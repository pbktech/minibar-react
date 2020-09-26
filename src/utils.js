import React from "react";

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const displayDate = (d) => {
  if (d.toLowerCase() === "present") {
    return d;
  } else {
    const [m, y] = d.split('/');
    return months[parseInt(m) - 1] + ', ' + y;
  }
}

export const ApiRequest = (API_ENDPOINT) => {
  return fetch(API_ENDPOINT)
           .then(response => {
             if (response.ok) {
               return response.json();
             } else {
               console.log(response);
               throw new Error('Something went wrong ...');
             }
           });
}

const encodeFormData = (data) => {
  return Object.keys(data)
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
      .join('&');
}

export const ApiPostRequest = (API_ENDPOINT, data = {}) => {
  const response = fetch(API_ENDPOINT, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: encodeFormData(data)
  });
  return response.json();
}

export const CartCss = () => {
  return <style type="text/css">
    {`
      .btn-brand {
        font-family: "Gotham Black" !important;
          color: #fff !important;
          background-color: #b2d235 !important;
          border-color: #b2d235 !important;
          border-radius: 100px;
      }
      .btn-brand:hover {
          color: #fff;
          background-color: #00bdd0;
          border-color: #00bdd0;
      }
      .btn-brand:focus,
      .btn-brand.focus {
          color: #fff;
          background-color: #00bdd0;
          border-color: #00bdd0;
      }
      .btn-brand:active,
      .btn-brand.active,
      .open > .btn-brand.dropdown-toggle {
          color: #fff;
          background-color: #00bdd0;
          border-color: #00bdd0;
          background-image: none;
      }
      .btn-brand:active:hover,
      .btn-brand:active:focus,
      .btn-brand:active.focus,
      .btn-brand.active:hover,
      .btn-brand.active:focus,
      .btn-brand.active.focus,
      .open > .btn-brand.dropdown-toggle:hover,
      .open > .btn-brand.dropdown-toggle:focus,
      .open > .btn-brand.dropdown-toggle.focus {
          color: #fff;
          background-color: #00a6b7;
          border-color: #00a6b7;
      }
      .btn-brand.disabled:focus,
      .btn-brand.disabled.focus,
      .btn-brand:disabled:focus,
      .btn-brand:disabled.focus {
          background-color: #b2d235;
          border-color: #b2d235;
      }
      .btn-brand.disabled:hover,
      .btn-brand:disabled:hover {
          background-color: #b2d235;
          border-color: #b2d235;
      }
      .btn-brand-inverted {
          font-family: "Gotham Black";
          color: #b2d235;
          background-color: #fff;
          border-color: #b2d235;
      }
      .btn-brand-inverted:hover {
          color: #fff;
          background-color: #00bdd0;
          border-color: #00bdd0;
      }
      .btn-brand-inverted:focus,
      .btn-brand-inverted.focus {
          color: #fff;
          background-color: #00bdd0;
          border-color: #00bdd0;
      }
      .btn-brand-inverted:active,
      .btn-brand-inverted.active,
      .open > .btn-brand-inverted.dropdown-toggle {
          color: #fff;
          background-color: #00bdd0;
          border-color: #00bdd0;
          background-image: none;
      }
      .btn-brand-inverted:active:hover,
      .btn-brand-inverted:active:focus,
      .btn-brand-inverted:active.focus,
      .btn-brand-inverted.active:hover,
      .btn-brand-inverted.active:focus,
      .btn-brand-inverted.active.focus,
      .open > .btn-brand-inverted.dropdown-toggle:hover,
      .open > .btn-brand-inverted.dropdown-toggle:focus,
      .open > .btn-brand-inverted.dropdown-toggle.focus {
          color: #fff;
          background-color: #00a6b7;
          border-color: #00a6b7;
      }
      .btn-brand-inverted.disabled:focus,
      .btn-brand-inverted.disabled.focus,
      .btn-brand-inverted:disabled:focus,
      .btn-brand-inverted:disabled.focus {
          background-color: #fff;
          border-color: #b2d235;
      }
      .btn-brand-inverted.disabled:hover,
      .btn-brand-inverted:disabled:hover {
          background-color: #fff;
          border-color: #b2d235;
      }
      .btn-brand-alt {
          font-family: "Gotham Black";
          color: #fff;
          background-color: #00bdd0;
          border-color: #00bdd0;
          border-radius: 100px;
      }
      .btn-brand-alt:hover {
          color: #fff;
          background-color: #b2d235;
          border-color: #b2d235;
      }
      .btn-brand-alt:focus,
      .btn-brand-alt.focus {
          color: #fff;
          background-color: #b2d235;
          border-color: #b2d235;
      }
      .btn-brand-alt:active,
      .btn-brand-alt.active,
      .open > .btn-brand-alt.dropdown-toggle {
          color: #fff;
          background-color: #b2d235;
          border-color: #b2d235;
          background-image: none;
      }
      .btn-brand-alt:active:hover,
      .btn-brand-alt:active:focus,
      .btn-brand-alt:active.focus,
      .btn-brand-alt.active:hover,
      .btn-brand-alt.active:focus,
      .btn-brand-alt.active.focus,
      .open > .btn-brand-alt.dropdown-toggle:hover,
      .open > .btn-brand-alt.dropdown-toggle:focus,
      .open > .btn-brand-alt.dropdown-toggle.focus {
          color: #fff;
          background-color: #a3c22b;
          border-color: #a3c22b;
      }
      .btn-brand-alt.disabled:focus,
      .btn-brand-alt.disabled.focus,
      .btn-brand-alt:disabled:focus,
      .btn-brand-alt:disabled.focus {
          background-color: #00bdd0;
          border-color: #00bdd0;
      }
      .btn-brand-alt.disabled:hover,
      .btn-brand-alt:disabled:hover {
          background-color: #00bdd0;
          border-color: #00bdd0;
      }
      .btn-tabs {
          font-family: "Gotham Black";
          color: #fff;
          background-color: #00bdd0;
          border-color: #00bdd0;
      }
      .btn-tabs:hover {
          color: #fff;
          background-color: #b2d235;
          border-color: #b2d235;
      }
      .btn-tabs:focus,
      .btn-tabs.focus {
          color: #fff;
          background-color: #b2d235;
          border-color: #b2d235;
      }
      .btn-tabs:active,
      .btn-tabs.active,
      .open > .btn-tabs.dropdown-toggle {
          color: #fff;
          background-color: #b2d235;
          border-color: #b2d235;
          background-image: none;
      }
      .btn-tabs:active:hover,
      .btn-tabs:active:focus,
      .btn-tabs:active.focus,
      .btn-tabs.active:hover,
      .btn-tabs.active:focus,
      .btn-tabs.active.focus,
      .open > .btn-tabs.dropdown-toggle:hover,
      .open > .btn-tabs.dropdown-toggle:focus,
      .open > .btn-tabs.dropdown-toggle.focus {
          color: #fff;
          background-color: #a3c22b;
          border-color: #a3c22b;
      }
      .btn-tabs.disabled:focus,
      .btn-tabs.disabled.focus,
      .btn-tabs:disabled:focus,
      .btn-tabs:disabled.focus {
          background-color: #00bdd0;
          border-color: #00bdd0;
      }
      .btn-tabs.disabled:hover,
      .btn-tabs:disabled:hover {
          background-color: #00bdd0;
          border-color: #00bdd0;
      }
      .btn-cart {
          font-family: "Gotham Black";
          font-size: 0.75rem;
          text-transform: none;
          padding: 0.3em 1.1em;
          color: #fff;
          background-color: #b2d235;
          border-color: #b2d235;
      }
      .btn-cart:before {
          display: inline-block;
          font: normal normal normal 14px/1 FontAwesome;
          font-size: inherit;
          text-rendering: auto;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          content: "";
          margin-right: 0.5em;
      }
      .btn-cart:after {
          content: " " attr(data-cart-label);
      }
      .btn-cart:hover {
          color: #fff;
          background-color: #00bdd0;
          border-color: #00bdd0;
      }
      .btn-cart:focus,
      .btn-cart.focus {
          color: #fff;
          background-color: #00bdd0;
          border-color: #00bdd0;
      }
      .btn-cart:active,
      .btn-cart.active,
      .open > .btn-cart.dropdown-toggle {
          color: #fff;
          background-color: #00bdd0;
          border-color: #00bdd0;
          background-image: none;
      }
      .btn-cart:active:hover,
      .btn-cart:active:focus,
      .btn-cart:active.focus,
      .btn-cart.active:hover,
      .btn-cart.active:focus,
      .btn-cart.active.focus,
      .open > .btn-cart.dropdown-toggle:hover,
      .open > .btn-cart.dropdown-toggle:focus,
      .open > .btn-cart.dropdown-toggle.focus {
          color: #fff;
          background-color: #00a6b7;
          border-color: #00a6b7;
      }
      .btn-cart.disabled:focus,
      .btn-cart.disabled.focus,
      .btn-cart:disabled:focus,
      .btn-cart:disabled.focus {
          background-color: #b2d235;
          border-color: #b2d235;
      }
      .btn-cart.disabled:hover,
      .btn-cart:disabled:hover {
          background-color: #b2d235;
          border-color: #b2d235;
      }
      .btn-cart--empty {
          display: none !important;
      }
      .btn-block {
          padding-left: 0.9375rem;
          padding-right: 0.9375rem;
      }
  `}
  </style>
}
