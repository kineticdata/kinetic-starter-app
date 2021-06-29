import React from "react";
import { Link, Route, Switch, Redirect } from "react-router-dom";
import { logoutDirect } from "@kineticdata/react";
import { Form } from "./pages/Form";
import { FormList } from "./pages/FormList";
import { KappList } from "./pages/KappList";
import { SubmissionList } from "./pages/SubmissionList";
import { NotFound } from "./pages/NotFound";
import { appLogout } from "./App";

export const PrivateFacing = () => (
  <>
    <header className="private">
      <h1>Private</h1>
      <Link to="/kapps">Kapps</Link>
      <div className="buttons">
        <button onClick={logoutDirect}>Timeout</button>
        <button onClick={appLogout}>Logout</button>
      </div>
    </header>
    <main>
      <Switch>
        <Route path="/" render={() => "Welcome to the secret stuff"} exact />
        <Route path="/kapps" render={() => <KappList private />} exact />
        <Route  path="/kapps/:kappSlug" exact> 
          <Redirect to="forms" />
        </Route>
        <Route 
          path="/kapps/:kappSlug/forms" 
          render={() => <FormList private />} 
          exact 
        />
        <Route
          path="/kapps/:kappSlug/forms/:formSlug"
          render={() => <Form private />}
          exact
        />
        <Route
          path="/kapps/:kappSlug/forms/:formSlug/submissions"
          render={() => <SubmissionList private />}
          exact
        />
        <Route 
          path="/kapps/:kappSlug/forms/:formSlug/submissions/:id" 
          render={() => 
            <Form private />
          }
          exact  
        />
        <Route component={NotFound} />
      </Switch>
    </main>
  </>
);
