import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FormTable } from '@kineticdata/react';
import { useParams } from 'react-router';
import * as TableComponents from './TableComponents';

export const NameCell = ({ tableOptions: { kappSlug }, row }) => (
  <td>
    <Link to={`/kapps/${kappSlug}/forms/${row.get('slug')}/submissions`}>
      {row.get('name')}
    </Link>
    <br />
    <small>{row.get('slug')}</small>
  </td>
);

export const SubmitNew = ({ tableOptions: { kappSlug }, row }) => (
  <td>
    <Link to={`/kapps/${kappSlug}/forms/${row.get('slug')}`}>submit new</Link>
  </td>
);

export const FormList = props => {
  const { kappSlug } = useParams();

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

  return (
    <FormTable
      kappSlug={kappSlug}
      columnSet={['name', '_submit-new']}
      components={{ ...TableComponents }}
      addColumns={[
        {
          value: '_submit-new',
          components: {
            BodyCell: SubmitNew,
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
      // omitHeader={true}
    >
      {({ pagination, table }) => (
        <>
          <h1>Forms</h1>
          <div>
            {table}
            {pagination}
          </div>
        </>
      )}
    </FormTable>
  );
};
