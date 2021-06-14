import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";

import { App } from "./components/app/app";

require("./components/app/scss/app.scss");

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById("root")
);
