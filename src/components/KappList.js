import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { useCrumbs, useKappsList } from '../hooks';

export const KappList = ({ authorized, setCrumbs }) => {
  // fetch the list of kapps
  const [kapps, paging] = useKappsList();

  // clear breadcrumbs on load
  useCrumbs({ setCrumbs });

  return (
    <>
      <h1>Kapps</h1>
      <Link to="/users">View Users</Link>
      <br/>
      <table className="table" cellPadding={0} cellSpacing={0}>
        <thead>
          <tr>
            <th>Name</th>
            {authorized && <th>Updated</th>}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {!kapps && (
            <tr>
              <td colSpan={authorized ? 3 : 2}>
                {paging.loading ? 'Loading...' : 'Error!'}
              </td>
            </tr>
          )}
          {kapps &&
            kapps.map(kapp => (
              <tr key={kapp.slug}>
                <td>
                  <Link to={`/kapps/${kapp.slug}/forms`}>{kapp.name}</Link>
                  <br />
                  <small>{kapp.slug}</small>
                </td>
                {authorized && <td>{moment(kapp.updatedAt).format('LLL')}</td>}
                <td className="actions-cell">
                  <a
                    href={`/app/console/#/kapps/${kapp.slug}/settings/details`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <button className="btn">Edit</button>
                  </a>
                </td>
              </tr>
            ))}
          {kapps && kapps.length === 0 && (
            <tr>
              <td colSpan={authorized ? 3 : 2}>
                There are no Kapps to display
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {kapps && (
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
