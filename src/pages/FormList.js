import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchForms } from "@kineticdata/react";
import { WallySpinner } from "./Loading";
import { useParams } from "react-router";

export const FormList = props => {
  const [{ forms, error }, setForms] = useState({});
  const { kappSlug } = useParams();

  useEffect(() => {
    fetchForms({
      kappSlug: kappSlug,
      public: !props.private
    }).then(setForms);
  }, [props.private]);

  return forms ? (
    <Fragment>
      <h1>Forms</h1>
      <ul>
        {forms
          .filter(form => props.private || !form.private)
          .map(form => (
            <li className="list-item--form" key={form.slug}>
              <span >
                <span>{form.name}</span>
                <Link to={`/kapps/${kappSlug}/forms/${form.slug}`}>submit new</Link>
                <Link to={`/kapps/${kappSlug}/forms/${form.slug}/submissions`}>view submitted</Link></span>
            </li>
          ))}
      </ul>
    </Fragment>
  ) : error ? (
    <pre>{JSON.stringify(error)}</pre>
  ) : (
    <WallySpinner />
  );
};
