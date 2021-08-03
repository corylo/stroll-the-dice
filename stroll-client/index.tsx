import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";

import "@stripe/stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import { STRIPE_PUBLISHABLE_KEY } from "./config/stripe";

import { App } from "./components/app/app";

require("./components/app/scss/app.scss");

ReactDOM.render(
  <Router>
    <Elements stripe={loadStripe(STRIPE_PUBLISHABLE_KEY)}>
      <App />
    </Elements>
  </Router>,
  document.getElementById("root")
);
