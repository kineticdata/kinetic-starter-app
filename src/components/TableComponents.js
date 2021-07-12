import React, { Fragment } from 'react';
import { isImmutable } from 'immutable';
import { Link } from 'react-router-dom';

// allows tables to define the fields desired for filtering / see SubmissionsList
export const generateFilterFormLayout = filterSet => ({ buttons, fields }) => (
  <Fragment>
    {filterSet.map(fs => (
      <Fragment key={fs}>{fields.get(fs)}</Fragment>
    ))}
    {buttons}
  </Fragment>
);

const isFiltering = appliedFilters =>
  appliedFilters.some(
    filterValue => isImmutable(filterValue) && filterValue.get('value') !== '',
  );

// default state for tables with no / missing data
export const generateEmptyBodyRow = ({
  loadingMessage = 'Loading items...',
  noSearchResultsMessage = 'No items were found - please modify your search criteria',
  noItemsMessage = 'There are no items to display.',
  noItemsLinkTo = null,
  noItemsLinkToMessage = 'Add new item',
  errorMessage = 'There was a problem loading information from the server!',
} = {}) => props => {
  // Because most uses wont pass renderOptions or renderOptions won't contain
  // `addAuthorized` we explicitly check for `false` not any falsey value.
  const addAuthorized =
    !props.renderOptions || props.renderOptions.addAuthorized !== false;

  const content = props.loading ? (
    /* Visible if there are no items in the list and your table is loading or initializing data. */

    <td colSpan={props.colSpan}>Loading...</td>
  ) : props.error ? (
    props.error.message ? (
      <td colSpan={props.colSpan} className="table-error-message">
        {errorMessage} <br /> <small>({props.error.message})</small>
      </td>
    ) : (
      <td colSpan={props.colSpan} className="table-error-message">
        {errorMessage}
      </td>
    )
  ) : isFiltering(props.appliedFilters) ? (
    /* Visible if there are no items in the list and you have filter criteria */

    <td className="no-data__title table-error-message">
      {noSearchResultsMessage}
    </td>
  ) : (
    /* Visible if there are no items in the list and you are not searching */
    <>
      <td className="no-data__title table-error-message">{noItemsMessage}</td>
      {addAuthorized && noItemsLinkTo ? (
        typeof noItemsLinkTo === 'function' ? (
          <button className="btn btn-link" onClick={noItemsLinkTo}>
            {noItemsLinkToMessage}
          </button>
        ) : (
          <Link to={noItemsLinkTo}>
            <span className="fa fa-plus fa-fw" />
            {noItemsLinkToMessage}
          </Link>
        )
      ) : null}
    </>
  );
  return <tr className="no-data text-center">{content}</tr>;
};

// Default Table Layout
export const TableLayout = ({ header, body, footer }) => (
  <div className="table-container">
    <table className="table" cellSpacing="0" cellPadding="0">
      {header}
      {body}
      {footer}
    </table>
  </div>
);

// Pagination Control
export const PaginationControl = ({
  nextPage,
  prevPage,
  loading,
  startIndex,
  endIndex,
  count,
}) => (
  <div className="table--footer d-flex justify-content-between align-items-center">
    <p className="pagination-label">
      {`Displaying ${startIndex} - ${endIndex}`}
    </p>
    {(nextPage || prevPage) && (
      <nav className="pagination-buttons">
        <button
          disabled={!prevPage || loading}
          onClick={prevPage}
          className="pagination-button"
        >
          <i
            className="fa fa-play fa-flip-horizontal d-block"
            aria-hidden="true"
          />
          Previous
        </button>
        <button
          disabled={!nextPage || loading}
          onClick={nextPage}
          className="pagination-button"
        >
          <i className="fa fa-play d-block" aria-hidden="true" />
          Next
        </button>
      </nav>
    )}
  </div>
);
