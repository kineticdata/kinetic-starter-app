import React from 'react';
import './App.css';
import { KineticLib } from '@kineticdata/react';
import { WallySpinner } from './components/Loading';
import { Header } from './components/Header';
import * as TableComponents from './components/TableComponents';
import { SMS_SIGN_UP_FORM } from './constants';
import { CoreForm } from '@kineticdata/react';
import './assets/styles/forms.css';

// use Wally for empty app
export const EmptyBodyRow = () => <WallySpinner />;

export const App = () => {
  return (
    <KineticLib components={{ ...TableComponents, EmptyBodyRow }} locale="en">
      {({ initialized }) => (
        <>
          <Header />
          {!initialized ? (
            <WallySpinner />
          ) : (
            <CoreForm 
              kapp={"services"}
              form={SMS_SIGN_UP_FORM}
              public={true}
            />
          )}
        </>
      )}
    </KineticLib>
  );
};
