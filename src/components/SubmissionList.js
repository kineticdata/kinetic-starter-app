import React, { useEffect, useState } from 'react';
import {
  SubmissionTable,
  deleteSubmission,
  fetchForm,
  mountTable,
  unmountTable,
} from '@kineticdata/react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import * as TableComponents from './TableComponents';

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

export const SubmissionList = props => {
  const { kappSlug, formSlug } = useParams();

  // build table key and mount table since we are using the filter form
  const tableKey = submissionsTableKey(kappSlug, formSlug);
  useEffect(() => {
    mountTable(tableKey);
    return () => {
      unmountTable(tableKey);
    };
  }, []);

  // fetch and set form
  const [form, setForm] = useState();
  useEffect(() => {
    async function fetchFormRequest() {
      let response = await fetchForm({
        kappSlug,
        formSlug,
        include: 'kapp',
      });
      setForm(response.form);
    }
    fetchFormRequest();
  }, []);

  // set navigation breadcrumbs using fetched form info
  useEffect(() => {
    props.setCrumbs([
      {
        path: '/kapps',
        name: 'Kapps',
      },
      {
        path: `/kapps/${kappSlug}/forms`,
        name: `${form ? form.kapp.name : 'Forms'}`,
      },
    ]);
  }, [form, props.setCrumbs]);

  // structure for each cell in the handle column
  const HandleCell = ({ row }) => (
    <td>
      <Link
        to={`/kapps/${kappSlug}/forms/${formSlug}/submissions/${row.get('id')}`}
      >
        {row.get('handle')}
      </Link>
    </td>
  );

  // structure for each cell in the actions column
  // placed after tableKey is defined so we can remount table
  const ActionsCell = ({ row }) => (
    <td className="actions-cell">
      <Link
        to={`/kapps/${kappSlug}/forms/${formSlug}/submissions/${row.get('id')}`}
      >
        <button>Review</button>
      </Link>
      <button
        onClick={() => {
          deleteSubmission({ id: row.get('id') });
          unmountTable(tableKey);
          mountTable(tableKey);
        }}
      >
        Delete
      </button>
    </td>
  );

  return (
    <SubmissionTable
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
