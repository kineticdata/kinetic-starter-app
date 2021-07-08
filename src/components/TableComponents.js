import React, { Fragment } from 'react';
import { isImmutable } from 'immutable';
import { Link } from 'react-router-dom';
// import { LoadingMessage } from '@kineticdata/bundle-common';
import { I18n } from '@kineticdata/react';

const isFiltering = appliedFilters =>
  appliedFilters.some(
    filterValue => isImmutable(filterValue) && filterValue.get('value') !== '',
  );

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

    <td colSpan={props.colSpan}>
      {/* <LoadingMessage title={loadingMessage} /> */}
      Loading...
    </td>
  ) : props.error ? (
    props.error.message ? (
      <td colSpan={props.colSpan}>
        <em>
          {errorMessage} <br /> <small>({props.error.message})</small>
        </em>
      </td>
    ) : (
      <td colSpan={props.colSpan}>
        <em>{errorMessage}</em>
      </td>
    )
  ) : isFiltering(props.appliedFilters) ? (
    /* Visible if there are no items in the list and you have filter criteria */

    <em className="no-data__title">{noSearchResultsMessage}</em>
  ) : (
    /* Visible if there are no items in the list and you are not searching */
    <>
      <em className="no-data__title">{noItemsMessage}</em>
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

export const Header = ({ headerRow }) => <thead>{headerRow}</thead>;

export const HeaderRow = ({ columnHeaders }) => <tr>{columnHeaders}</tr>;

export const HeaderCell = ({ title }) => <th>{title}</th>;

export const Body = ({ tableRows }) => <tbody>{tableRows}</tbody>;

export const BodyRow = ({ cells }) => <tr>{cells}</tr>;

export const BodyCell = ({ value }) => (
  <td>
    <I18n>{value}</I18n>
  </td>
);

export const TableLayout = ({ header, body, footer }) => (
  <div className="table-container">
    <table className="table">
      {header}
      {body}
      {footer}
    </table>
  </div>
);

export const PaginationControl = ({
  nextPage,
  prevPage,
  loading,
  startIndex,
  endIndex,
  count,
}) => (
  <div className="table--footer d-flex justify-content-between align-items-center">
    <p className="ml-2 mb-0 align-items-center">
      {`Displaying ${startIndex} - ${endIndex}`}
    </p>
    {(nextPage || prevPage) && (
      <nav className="d-flex mr-3 align-items-center">
        {/* <button
    disabled={currentPage === 1}
    onClick={handleJumpFirstPage}
    className="btn__no-style"
  >
    <i className="fa fa-step-backward d-block" aria-hidden="true" />
  </button> */}
        <button
          disabled={!prevPage || loading}
          onClick={prevPage}
          className="px-2 btn__no-style"
        >
          <i
            className="fa fa-play fa-flip-horizontal d-block"
            aria-hidden="true"
          />
        </button>

        <button
          disabled={!nextPage || loading}
          onClick={nextPage}
          className="px-2 btn__no-style"
        >
          <i className="fa fa-play d-block" aria-hidden="true" />
        </button>
      </nav>
    )}
  </div>
);
