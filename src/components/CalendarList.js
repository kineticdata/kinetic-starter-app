import React from 'react';
import { Link } from 'react-router-dom';
import { FormTable } from '@kineticdata/react';
import { useParams } from 'react-router';
import * as TableComponents from './TableComponents';
import { useCrumbs, useKapp } from '../hooks';
import { CALENDAR_KAPP_SLUG } from '../constants';

// structure for each cell in the name column
export const NameCell = ({ tableOptions: { kappSlug }, row }) => (
  <td>
    <Link to={`/calendar/${row.get('slug')}`}>
      {row.get('name')}
    </Link>
    <br />
    <small>{row.get('slug')}</small>
  </td>
);

// structure for each cell in the actions column
export const ActionsCell = ({ tableOptions: { kappSlug }, row }) => (
  <td className="actions-cell">
    <Link to={`/calendar/${row.get('slug')}`}>
      <button>Open Calendar</button>
    </Link>
  </td>
);

// overriding the default table empty body row
const EmptyBodyRow = TableComponents.generateEmptyBodyRow({
  loadingMessage: 'Loading Calendars...',
  noItemsMessage: 'There are no Calendars to display.',
});

// overriding the default header cell for this table, passed into "components"
export const HeaderCell = ({ title }) => <th className="th-dark">{title}</th>;

export const CalendarList = ({ setCrumbs }) => {
  const kappSlug  = CALENDAR_KAPP_SLUG;

  // fetch and set kapp
  // const kapp = useKapp(kappSlug);

  // set navigation breadcrumbs
  // useCrumbs({ setCrumbs, kappSlug });

  return (
    <FormTable
      kappSlug={kappSlug}
      columnSet={['name', 'actions']}
      components={{ ...TableComponents, EmptyBodyRow, HeaderCell }} // overridden components from above
      addColumns={[
        {
          value: 'actions',
          title: ' ',
          components: {
            BodyCell: ActionsCell,
          },
        },
      ]}
      alterColumns={{
        name: {
          components: {
            BodyCell: NameCell,
          },
        },
      }}
      sortable={false}
    >
      {({ pagination, table }) => (
        <>
          <h1>Calendars</h1>
          <div>
            {table}
            {pagination}
          </div>
        </>
      )}
    </FormTable>
  );
};
