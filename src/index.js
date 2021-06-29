import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable'
import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import { createHashHistory } from "history";
import { App } from "./App";

export const history = createHashHistory();

ReactDOM.render(
  <Router history={history}>
    <App />
  </Router>,
  document.getElementById("root")
);
