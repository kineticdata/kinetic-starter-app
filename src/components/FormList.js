import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FormTable, fetchKapp } from '@kineticdata/react';
import { useParams } from 'react-router';
import * as TableComponents from './TableComponents';

// structure for each cell in the name column
export const NameCell = ({ tableOptions: { kappSlug }, row }) => (
  <td>
    <Link to={`/kapps/${kappSlug}/forms/${row.get('slug')}/submissions`}>
      {row.get('name')}
    </Link>
    <br />
    <small>{row.get('slug')}</small>
  </td>
);

// structure for each cell in the actions column
export const ActionsCell = ({ tableOptions: { kappSlug }, row }) => (
  <td className="actions-cell">
    <Link to={`/kapps/${kappSlug}/forms/${row.get('slug')}`}>
      <button>Submit New</button>
    </Link>
  </td>
);

// overriding the default table empty body row
const EmptyBodyRow = TableComponents.generateEmptyBodyRow({
  loadingMessage: 'Loading Forms...',
  noItemsMessage: 'There are no Forms to display.',
});

// overriding the default header cell for this table, passed into "components"
export const HeaderCell = ({ title }) => <th className="th-dark">{title}</th>;

export const FormList = props => {
  const { kappSlug } = useParams();

  // set navigation breadcrumbs
  useEffect(
    () =>
      props.setCrumbs([
        {
          path: '/kapps',
          name: 'Kapps',
        },
      ]),
    [props.setCrumbs],
  );

  // fetch and set kapp
  const [kapp, setKapp] = useState();
  useEffect(() => {
    async function fetchKappRequest() {
      let response = await fetchKapp({
        kappSlug,
      });
      setKapp(response.kapp);
    }
    fetchKappRequest();
  }, []);

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
          <h1>{kapp && `${kapp.name}: `}Forms</h1>
          <div>
            {table}
            {pagination}
          </div>
        </>
      )}
    </FormTable>
  );
};
