import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { KappTable } from '@kineticdata/react';
import * as TableComponents from './TableComponents';
import moment from 'moment';

// structure of each cell in the name column
export const NameCell = ({ row }) => (
  <td>
    <Link to={`/kapps/${row.get('slug')}/forms`}>{row.get('name')}</Link>
    <br />
    <small>{row.get('slug')}</small>
  </td>
);

// structure of each cell in the updatedAt column
export const DateCell = ({ row }) => (
  <td>{moment(row.get('updatedAt')).format('LLL')}</td>
);

// structure of each cell in the actions column
export const ActionsCell = ({ row }) => (
  <td className="actions-cell">
    <Link to={`/app/console/#/kapps/${row.get('slug')}/settings/details`}>
      <button className="btn btn-xs btn-danger">
        <span className="fa fa-pencil fa-fw" /> Edit
      </button>
    </Link>
  </td>
);

// overriding the default table empty body row
const EmptyBodyRow = TableComponents.generateEmptyBodyRow({
  loadingMessage: 'Loading Kapps...',
  noItemsMessage: 'There are no Kapps to display.',
});

export const KappList = props => {
  // clear breadcrumbs on load
  useEffect(() => props.setCrumbs([]), [props.setCrumbs]);

  return (
    <KappTable
      components={{ ...TableComponents, EmptyBodyRow }}
      columnSet={
        props.authorized
          ? ['name', 'updatedAt', 'actions']
          : ['name', 'updatedAt']
      }
      addColumns={[
        {
          value: 'actions',
          title: ' ',
          sortable: false,
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
        updatedAt: {
          components: {
            BodyCell: DateCell,
          },
        },
      }}
      sortable={false}
    >
      {({ pagination, table }) => (
        <>
          <h1>Kapps</h1>
          <div>
            {table}
            {pagination}
          </div>
        </>
      )}
    </KappTable>
  );
};
