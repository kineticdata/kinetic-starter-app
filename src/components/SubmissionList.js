import React, { useEffect } from 'react';
import {
  SubmissionTable,
  deleteSubmission,
  mountTable,
  unmountTable,
  refetchTable,
} from '@kineticdata/react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import * as TableComponents from './TableComponents';
import { useCrumbs, useForm } from '../hooks';

// define the fields used for filtering
const FilterFormLayout = TableComponents.generateFilterFormLayout([
  'handle',
  'coreState',
]);

// override the default empty body row from TableComponents
const EmptyBodyRow = TableComponents.generateEmptyBodyRow({
  loadingMessage: 'Loading...',
  noSearchResultsMessage: 'No search results',
  noItemsMessage: 'No submissions to display',
  errorMessage: 'Error',
});

// used to build the table key necessary for mounting the table / rendering the filter form
const submissionsTableKey = (kappSlug, formSlug) =>
  `${kappSlug}-${formSlug}-tablekey`;

export const SubmissionList = ({ setCrumbs }) => {
  const { kappSlug, formSlug } = useParams();

  // build table key and mount table since we are using the filter form
  const tableKey = submissionsTableKey(kappSlug, formSlug);
  useEffect(() => {
    mountTable(tableKey);
    return () => {
      unmountTable(tableKey);
    };
  });

  // Fetch the form.
  const form = useForm(kappSlug, formSlug);
  useCrumbs({ setCrumbs, form, kappSlug, formSlug });

  const handleDelete = row => () => {
    deleteSubmission({ id: row.get('id') }).then(() => refetchTable(tableKey));
  };

  // structure for each cell in the handle column
  const HandleCell = ({ row }) => {
    const isDraft = row.get('coreState') === 'Draft';

    return (
      <td>
        <Link
          to={`/kapps/${kappSlug}/forms/${formSlug}/submissions/${row.get(
            'id',
          )}${isDraft ? '/edit' : ''}`}
        >
          {row.get('handle')}
        </Link>
      </td>
    );
  };

  // structure for each cell in the actions column
  // placed after tableKey is defined so we can remount table
  const ActionsCell = ({ row }) => {
    const isDraft = row.get('coreState') === 'Draft';

    return (
      <td className="actions-cell">
        <Link
          to={`/kapps/${kappSlug}/forms/${formSlug}/submissions/${row.get(
            'id',
          )}${isDraft ? '/edit' : ''}`}
        >
          <button>{isDraft ? 'Edit' : 'Review'}</button>
        </Link>
        <button onClick={handleDelete(row)}>Delete</button>
      </td>
    );
  };

  return (
    <SubmissionTable
      mode="form"
      tableKey={tableKey} // set so we can mount the table / render the filter form
      kappSlug={kappSlug}
      formSlug={formSlug}
      columnSet={['handle', 'submittedBy', 'coreState', 'actions']}
      components={{
        ...TableComponents,
        FilterFormLayout,
        EmptyBodyRow,
      }}
      addColumns={[
        {
          value: 'actions',
          sortable: false,
          components: {
            BodyCell: ActionsCell,
          },
        },
      ]}
      alterColumns={{
        handle: {
          components: {
            BodyCell: HandleCell,
          },
        },
      }}
    >
      {({ pagination, table, filter }) => (
        <>
          <div className="header-title-container">
            <h1>{form && `${form.name}: `}Submissions</h1>
            <Link to={`/kapps/${kappSlug}/forms/${formSlug}`}>
              <button>Submit New</button>
            </Link>
          </div>
          <div>
            <div className="table-filter">
              <h3>Filter:</h3>
              {filter}
            </div>
            {table}
            {pagination}
          </div>
        </>
      )}
    </SubmissionTable>
  );
};
