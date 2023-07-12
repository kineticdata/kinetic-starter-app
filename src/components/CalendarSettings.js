import React, { useEffect } from 'react';
import {
  SubmissionTable,
  deleteSubmission,
  mountTable,
  unmountTable,
  refetchTable,
} from '@kineticdata/react';
import { Link } from 'react-router-dom';
import * as TableComponents from './Layouts';
import { CALENDAR_KAPP_SLUG, CALENDAR_SETTINGS_FORM_SLUG } from '../constants';

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

export const CalendarSettings = () => {
  const kappSlug = CALENDAR_KAPP_SLUG;
  const formSlug = CALENDAR_SETTINGS_FORM_SLUG;
  const tableKey = `settings-tablekey`;

  useEffect(() => {
    mountTable(tableKey);
    return () => {
      unmountTable(tableKey);
    };
  });

  const handleDelete = row => () => {
    deleteSubmission({ id: row.get('id') }).then(() => refetchTable(tableKey));
  };

  // structure for each cell in the handle column
  const LabelCell = ({ row }) => {
    const isDraft = row.get('coreState') === 'Draft';

    return (
      <td>
        <Link to={`/settings/${row.get('id')}${isDraft ? '/edit' : ''}`}>
          {row.get('label')}
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
        <Link to={`/settings/${row.get('id')}${isDraft ? '/edit' : ''}`}>
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
      columnSet={['label', 'updatedAt', 'actions']}
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
        label: {
          components: {
            BodyCell: LabelCell,
          },
        },
      }}
    >
      {({ table }) => (
        <>
          <div className="header-title-container">
            <h1>Calendar Configurations</h1>
            <Link to={`/settings/new`}>
              <button>New</button>
            </Link>
          </div>
          <div>{table}</div>
        </>
      )}
    </SubmissionTable>
  );
};
