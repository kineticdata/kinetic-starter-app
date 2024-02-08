import React, { useState } from 'react';
import './App.css';
import { Link, Route, Switch } from 'react-router-dom';
import { WallySpinner } from './components/Loading';
import { Login } from './components/Login';
import { Header } from './components/Header';
import { Homepage } from './components/Homepage';
import { Opportunities } from './components/Opportunities';
import { ContactUs } from './components/ContactUs';
import { Form } from './components/Form';
import { FormList } from './components/FormList';
import { KappList } from './components/KappList';
import { SubmissionList } from './components/SubmissionList';
import { NotFound } from './components/NotFound';
import { Profile } from './components/Profile';
import { Users } from './components/Users';
import { useProfile, useSpace } from './hooks';
import { Footer } from './components/Footer';

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
      ) : (
        <div className="app-container">
          {/* <nav>
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
          </nav> */}
          <main>
            <Switch>
              <Route
                path="/login"
                render={() => (
                  <Login {...loginProps}/>
                )}
                exact
            />
              <Route
                path="/profile"
                render={() => (
                  <Profile setCrumbs={setBreadcrumbs} profile={profile} />
                )}
                exact
              />
              <Route
                path="/users"
                render={() => <Users setCrumbs={setBreadcrumbs} />}
                exact
              />
              <Route
                path={['/kapps']}
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
              <Route
                path={['/kapps/:kappSlug', '/kapps/:kappSlug/forms']}
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
              <Route
                path="/kapps/:kappSlug/forms/:formSlug/submissions/:id/edit"
                render={() => <Form setCrumbs={setBreadcrumbs} edit />}
                exact
              />
              <Route
                path="/"
                render={() => <Homepage/>}
                exact
              />
              <Route
                path="/opportunities"
                render={() => <Opportunities loggedIn={loggedIn}/>}
                exact
              />
              <Route
                path="/contact-us"
                render={() => <ContactUs/>}
                exact
              />
              <Route component={NotFound} />
            </Switch>
          </main>
        </div>
      )}
      <Footer />
      {timedOut && (
        <dialog open>
          <Login {...loginProps} />
        </dialog>
      )}
    </>
  );
};
