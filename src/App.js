import React, { useState } from 'react';
import './App.css';
import { Link, Route, Switch, Redirect } from 'react-router-dom';
import { WallySpinner } from './components/Loading';
import { Login } from './components/Login';
import { Header } from './components/Header';
import { Form } from './components/Form';
import { FormList } from './components/FormList';
import { CalendarList } from './components/CalendarList';
import { SubmissionList } from './components/SubmissionList';
import { NotFound } from './components/NotFound';
import { Profile } from './components/Profile';
import { useProfile, useSpace } from './hooks';
import './assets/styles/master.scss'

// use Wally for empty app
export const EmptyBodyRow = () => <WallySpinner />;

export const App = ({ initialized, loggedIn, loginProps, timedOut }) => {
  // breadcrumbs for navigation
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  // fetch and set space
  const space = useSpace();

  // fetch and set profile
  const profile = useProfile(loggedIn);

  return (
    <>
      <Header space={space} loggedIn={loggedIn} profile={profile} />
      {!initialized ? (
        <WallySpinner />
      ) : loggedIn ? (
        <div className="app-container">
          <nav>
            <ul className="breadcrumbs">
              {breadcrumbs &&
                breadcrumbs.map((breadcrumb, idx) => (
                  <li key={breadcrumb.path}>
                    <Link to={breadcrumb.path} className="breadcrumb-item">
                      {breadcrumb.name}
                    </Link>
                    {breadcrumbs.length > 1 && breadcrumbs.length - 1 > idx
                      ? '>'
                      : ''}
                  </li>
                ))}
            </ul>
          </nav>
          <main>
            <Switch>
              <Route
                path="/profile"
                render={() => (
                  <Profile setCrumbs={setBreadcrumbs} profile={profile} />
                )}
                exact
              />
              <Route
                path={['/', '/calendar']}
                render={() => (
                  <CalendarList
                    setCrumbs={setBreadcrumbs}
                    authorized={
                      profile && profile.authorization['Modification']
                    }
                  />
                )}
                exact
              />
              <Route
                path="/calendar/:formSlug"
                render={() => <Form setCrumbs={setBreadcrumbs} />}
                exact
              />
              <Route component={NotFound} />
            </Switch>
          </main>
        </div>
      ) : (
        <Login {...loginProps} />
      )}
      {timedOut && (
        <dialog open>
          <Login {...loginProps} />
        </dialog>
      )}
    </>
  );
};
