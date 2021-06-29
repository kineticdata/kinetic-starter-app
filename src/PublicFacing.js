import React from "react";
import { Link, Route, Switch, Redirect } from "react-router-dom";
import { FormList } from "./pages/FormList";
import { KappList } from "./pages/KappList";
import { SubmissionList } from "./pages/SubmissionList";
import { Form } from "./pages/Form";
import { Login } from "./pages/Login";

export const PublicFacing = ({ loginProps }) => {

  return (
    <>
      <header className="public">
        <h1>Public</h1>
        <Link to="/kapps">Kapps</Link>
        <Link to="/login">Login</Link>
        <Link to="/sign-up">Sign Up</Link>
      </header>
      <main>
        <Switch>
          <Route path="/" render={() => "Welcome!"} exact />
          <Route path="/kapps" render={() => <KappList public />} exact />
          <Route  path="/kapps/:kappSlug" exact> 
            <Redirect to="forms" />
          </Route>
          <Route 
            path="/kapps/:kappSlug/forms" 
            render={() => <FormList public />} 
            exact 
          />
          <Route
            path="/kapps/:kappSlug/forms/:formSlug"
            render={() => <Form public />}
            exact
          />
          <Route
            path="/kapps/:kappSlug/forms/:formSlug/submissions"
            render={() => <SubmissionList public />}
            exact
          />
          <Route 
            path="/kapps/:kappSlug/forms/:formSlug/submissions/:id" 
            render={() => <Form public />}
            exact  
          />
          <Route
            path="/sign-up"
            render={() => (
              <Login key="sign-up" mode="sign-up" {...loginProps} redirect />
            )}
          />
          <Route
            path="/password-reset"
            render={() => (
              <Login
                key="reset"
                mode="password-reset"
                {...loginProps}
                redirect
              />
            )}
          />
          <Route
            path="/login"
            render={() => <Login key="login" {...loginProps} redirect />}
          />
          <Route render={() => <Login {...loginProps} />} />
        </Switch>
      </main>
    </>
  );
};
