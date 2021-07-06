import React, { useEffect, useState } from 'react';
import './App.css';
import { KineticLib, logout, fetchSpace } from '@kineticdata/react';
import { history } from './index';
import { PrivateFacing } from './PrivateFacing';
import { WallySpinner } from './components/Loading';
import { Login } from './components/Login';
import { Header } from './components/Header';

export const appLogout = () => logout(() => history.push('/'));

export const TableLayout = ({ body }) => <table>{body}</table>;

export const Body = ({ tableRows }) => <tbody>{tableRows}</tbody>;

export const BodyRow = ({ cells }) => <tr>{cells}</tr>;

export const EmptyBodyRow = () => <WallySpinner />;

export const App = () => {
  // fetch and set space
  const [space, setSpace] = useState();
  useEffect(() => {
    async function fetchSpaceRequest() {
      let response = await fetchSpace();
      setSpace(response.space);
    }
    fetchSpaceRequest();
  }, []);

  return (
    <KineticLib
      components={{ TableLayout, Body, BodyRow, EmptyBodyRow }}
      locale="en"
    >
      {({ initialized, loggedIn, loginProps, timedOut }) => (
        <>
          <Header space={space} loggedIn={loggedIn} />
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
