import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SubmissionTable } from '@kineticdata/react';
import { useParams } from 'react-router';
import * as TableComponents from './TableComponents';

export const HandleCell = ({ row }) => (
  <td>
    {row.get('handle')} - {row.getIn(['form', 'name'])}
  </td>
);

export const ActionsCell = ({ tableOptions: { kappSlug }, row }) => (
  <td>
    <Link to={`/kapps/${kappSlug}/forms/${row.get('slug')}`}>submit new</Link>
  </td>
);

export const SubmissionList = props => {
  const { kappSlug, formSlug } = useParams();

  useEffect(() => {
    props.setCrumbs([
      {
        path: '/kapps',
        name: 'Kapps',
      },
      {
        path: `/kapps/${kappSlug}/forms`,
        name: 'Forms',
      },
    ]);
  }, [props.setCrumbs]);

  return (
    <SubmissionTable
      kappSlug={kappSlug}
      formSlug={formSlug}
      columnSet={['handle', 'actions']}
      components={{ ...TableComponents }}
      addColumns={[
        {
          value: 'actions',
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
      // omitHeader={true}
    >
      {({ pagination, table }) => (
        <>
          <h1>Submissions</h1>
          <div>
            {table}
            {pagination}
          </div>
        </>
      )}
    </SubmissionTable>
  );
};
