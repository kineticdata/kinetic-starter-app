import React from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';
import { useCrumbs, useFormsList, useKapp } from '../hooks';

export const FormList = ({ setCrumbs }) => {
  const { kappSlug } = useParams();

  // fetch and set kapp
  const kapp = useKapp(kappSlug);

  // fetch the list of forms for the kapp
  const [forms, paging] = useFormsList(kappSlug);

  // set navigation breadcrumbs
  useCrumbs({ setCrumbs, kappSlug, kapp });

  return (
    <>
      <h1>{kapp && `${kapp.name}: `}Forms</h1>
      <table className="table" cellPadding={0} cellSpacing={0}>
        <thead>
          <tr>
            <th>Name</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {!forms && (
            <tr>
              <td colSpan="2">{paging.loading ? 'Loading...' : 'Error!'}</td>
            </tr>
          )}
          {forms &&
            forms.map(form => (
              <tr key={form.slug}>
                <td>
                  <Link
                    to={`/kapps/${kappSlug}/forms/${form.slug}/submissions`}
                  >
                    {form.name}
                  </Link>
                  <br />
                  <small>{form.slug}</small>
                </td>
                <td className="actions-cell">
                  <Link to={`/kapps/${kappSlug}/forms/${form.slug}`}>
                    <button className="btn">Submit New</button>
                  </Link>
                </td>
              </tr>
            ))}
          {forms && forms.length === 0 && (
            <tr>
              <td colSpan="2">There are no Forms to display</td>
            </tr>
          )}
        </tbody>
      </table>
      {forms && (
        <div className="pagination-buttons">
          <button
            className="pagination-button"
            disabled={paging.loading || !paging.previousPage}
            onClick={paging.previousPage}
          >
            Previous Page
          </button>
          <span className="pagination-text">
            {!paging.loading
              ? `${paging.startIndex} - ${paging.endIndex}`
              : '...'}
          </span>
          <button
            className="pagination-button"
            disabled={paging.loading || !paging.nextPage}
            onClick={paging.nextPage}
          >
            Next Page
          </button>
        </div>
      )}
    </>
  );
};
