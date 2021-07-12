import React, { useEffect, useState } from 'react';
import './App.css';
import {
  KineticLib,
  logout,
  fetchSpace,
  fetchProfile,
} from '@kineticdata/react';
import { Link, Route, Switch, Redirect } from 'react-router-dom';
import { history } from './index';
import { WallySpinner } from './components/Loading';
import { Login } from './components/Login';
import { Header } from './components/Header';
import { Form } from './components/Form';
import { FormList } from './components/FormList';
import { KappList } from './components/KappList';
import { SubmissionList } from './components/SubmissionList';
import { NotFound } from './components/NotFound';
import { Profile } from './components/Profile';
import * as TableComponents from './components/TableComponents';

export const appLogout = () => logout(() => history.push('/'));

// use Wally for empty app
export const EmptyBodyRow = () => <WallySpinner />;

export const App = () => {
  // breadcrumbs for navigation
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  // fetch and set space
  const [space, setSpace] = useState();
  useEffect(() => {
    async function fetchSpaceRequest() {
      let response = await fetchSpace();
      setSpace(response.space);
    }
    fetchSpaceRequest();
  }, []);

  // fetch and set profile
  const [profile, setProfile] = useState();
  useEffect(() => {
    async function fetchProfileRequest() {
      let response = await fetchProfile({ include: 'authorization' });
      setProfile(response.profile);
    }
    fetchProfileRequest();
  }, []);

  return (
    <KineticLib components={{ ...TableComponents, EmptyBodyRow }} locale="en">
      {({ initialized, loggedIn, loginProps, timedOut }) => (
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
                    path={['/', '/kapps']}
                    render={() => (
                      <KappList
                        setCrumbs={setBreadcrumbs}
                        authorized={
                          profile && profile.authorization['Modification']
                        }
                      />
                    )}
                    exact
                  />
                  <Route path="/kapps/:kappSlug" exact>
                    <Redirect to="forms" />
                  </Route>
                  <Route
                    path="/kapps/:kappSlug/forms"
                    render={() => <FormList setCrumbs={setBreadcrumbs} />}
                    exact
                  />
                  <Route
                    path="/kapps/:kappSlug/forms/:formSlug"
                    render={() => <Form setCrumbs={setBreadcrumbs} />}
                    exact
                  />
                  <Route
                    path="/kapps/:kappSlug/forms/:formSlug/submissions"
                    render={() => <SubmissionList setCrumbs={setBreadcrumbs} />}
                    exact
                  />
                  <Route
                    path="/kapps/:kappSlug/forms/:formSlug/submissions/:id"
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
      )}
    </KineticLib>
  );
};
