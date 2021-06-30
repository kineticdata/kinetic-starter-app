import React, { useState } from 'react';
import { Link, Route, Switch, Redirect } from 'react-router-dom';
import { Form } from './pages/Form';
import { FormList } from './pages/FormList';
import { KappList } from './pages/KappList';
import { SubmissionList } from './pages/SubmissionList';
import { NotFound } from './pages/NotFound';

export const PrivateFacing = () => {
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  return (
    <>
      <nav>
        <ul className="breadcrumbs">
          {breadcrumbs &&
            breadcrumbs.map((breadcrumb, idx) => (
              <li key={breadcrumb.path}>
                <Link to={breadcrumb.path}>{breadcrumb.name}</Link>
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
            path={['/', '/kapps']}
            render={() => <KappList setCrumbs={setBreadcrumbs} />}
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
    </>
  );
};
