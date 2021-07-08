import React from 'react';
import { Link } from 'react-router-dom';
import { KappTable } from '@kineticdata/react';
import * as TableComponents from './TableComponents';
import { generateEmptyBodyRow } from './TableComponents';
import moment from 'moment';

export const NameCell = ({ row }) => (
  <td>
    <Link to={`/kapps/${row.get('slug')}/forms`}>{row.get('name')}</Link>
    <br />
    <small>{row.get('slug')}</small>
  </td>
);

export const DateCell = ({ row }) => (
  <td>{moment(row.get('updatedAt')).format('LLL')}</td>
);

export const ActionsCell = ({ row }) => (
  <td>
    <div className="btn-group pull-right">
      <Link to={`/app/console/#/kapps/${row.get('slug')}/settings/details`}>
        <button className="btn btn-xs btn-danger">
          <span className="fa fa-pencil fa-fw" /> Edit
        </button>
      </Link>
    </div>
  </td>
);

const EmptyBodyRow = generateEmptyBodyRow({
  loadingMessage: 'Loading Kapps...',
  noItemsMessage: 'There are no Kapps to display.',
});

export const KappList = props => {
  return (
    <KappTable
      components={{ ...TableComponents, EmptyBodyRow }}
      filterSet={['name']}
      columnSet={
        props.authorized
          ? ['name', 'updatedAt', 'actions']
          : ['name', 'updatedAt']
      }
      addColumns={[
        {
          value: 'actions',
          title: 'Actions',
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
    >
      {({ pagination, table, filter }) => (
        <>
          <h1>Kapps</h1>
          <div>
            {filter}
            {table}
            {pagination}
          </div>
        </>
      )}
    </KappTable>
  );
};
