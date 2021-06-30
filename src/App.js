import React, { useEffect, useState } from 'react';
import './App.css';
import { KineticLib, logout, fetchSpace } from '@kineticdata/react';
import { history } from './index';
import { PrivateFacing } from './PrivateFacing';
import { WallySpinner } from './pages/Loading';
import { Login } from './pages/Login';

export const appLogout = () => logout(() => history.push('/'));

export const TableLayout = ({ body }) => <table>{body}</table>;

export const Body = ({ tableRows }) => <tbody>{tableRows}</tbody>;

export const BodyRow = ({ cells }) => <tr>{cells}</tr>;

export const EmptyBodyRow = () => <WallySpinner />;

export const App = () => {
  // const [{ space, error }, setSpace] = useState();

  // useEffect(() => {
  //   fetchSpace().then(setSpace);
  // }, []);

  return (
    <KineticLib
      components={{ TableLayout, Body, BodyRow, EmptyBodyRow }}
      locale="en"
    >
      {({ initialized, loggedIn, loginProps, timedOut }) => (
        <>
          <header className="public">
            <h1>Public</h1>
            {loggedIn && (
              <div className="buttons">
                <button onClick={appLogout}>Logout</button>
              </div>
            )}
          </header>
          {!initialized ? (
            <WallySpinner />
          ) : loggedIn ? (
            <PrivateFacing />
          ) : (
            <Login {...loginProps} />
          )}
          {timedOut && (
            <dialog open>
              <Login {...loginProps} />
            </dialog>
          )}
        </>
      )}
    </KineticLib>
  );
};
