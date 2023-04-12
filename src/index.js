import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import { createHashHistory } from 'history';
import { App, EmptyBodyRow } from './App';
import * as TableComponents from './components/TableComponents';
import { KineticLib } from '@kineticdata/react';

// Asynchronously import the global dependencies that are used in the embedded
// forms. Note that we deliberately do this as a const so that it should start
// immediately without making the application wait but it will likely be ready
// before users nagivate to the actual forms.
const globals = import('./globals');

export const history = createHashHistory();

ReactDOM.render(
  <Router history={history}>
    <KineticLib components={{ ...TableComponents, EmptyBodyRow }} locale="en">
      {kineticProps => <App globals={globals} {...kineticProps} />}
    </KineticLib>
  </Router>,
  document.getElementById('root'),
);
