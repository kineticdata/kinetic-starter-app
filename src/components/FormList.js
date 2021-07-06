import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FormTable } from '@kineticdata/react';
import { useParams } from 'react-router';

export const SubmitNew = ({ tableOptions: { kappSlug }, row }) => (
  <td>
    <Link to={`/kapps/${kappSlug}/forms/${row.get('slug')}`}>submit new</Link>
  </td>
);

export const ViewSubmissions = ({ tableOptions: { kappSlug }, row }) => (
  <td>
    <Link to={`/kapps/${kappSlug}/forms/${row.get('slug')}/submissions`}>
      view submissions
    </Link>
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
      columnSet={['name', '_submit-new', '_view-submissions']}
      addColumns={[
        {
          value: '_submit-new',
          components: {
            BodyCell: SubmitNew,
          },
        },
        {
          value: '_view-submissions',
          components: {
            BodyCell: ViewSubmissions,
          },
        },
      ]}
      omitHeader={true}
    >
      {({ pagination, table }) => (
        <>
          <h1>Forms</h1>
          <div>{table}</div>
          <div>{pagination}</div>
        </>
      )}
    </FormTable>
  );
};
