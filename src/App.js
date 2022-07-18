import React, { useState } from 'react';
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
  const [display, setDisplay] = useState(0);

  return (
    <KineticLib components={{ ...TableComponents, EmptyBodyRow }} locale="en">
      {({ initialized }) => (
        <>
          <Header />
          <div className="wrapper">
            {!initialized ? (
              <WallySpinner />
            ) : display === 0 ? (
              <CoreForm
                kapp={'services'}
                form={SMS_SIGN_UP_FORM}
                completed={() => setDisplay(1)}
                public={true}
              />
            ) : display === 1 ? (
              <>
                <div className="submit-text">
                  Thank you for registering your number.
                </div>
                <div className="submit-text">
                  You should be receiving a SMS shortly.
                </div>
                <button onClick={() => setDisplay(0)}>
                  Register Another Number
                </button>
              </>
            ) : (
              <>Something went wrong!</>
            )}
          </div>
        </>
      )}
    </KineticLib>
  );
};
