import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchForms, FormTable } from '@kineticdata/react';
import { useParams } from 'react-router';
import { WallySpinner } from './Loading';

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
  const [{ forms, error }, setForms] = useState({});
  const { kappSlug } = useParams();

  useEffect(() => {
    if (!props.private) {
      fetchForms({
        kappSlug: kappSlug,
        public: !props.private,
      }).then(setForms);
    }
  }, [props.private]);

  return props.private ? (
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
  ) : forms ? (
    <Fragment>
      <h1>Forms</h1>
      <ul>
        {forms
          .filter(form => props.private || !form.private)
          .map(form => (
            <li className="list-item--form" key={form.slug}>
              <span>
                <span>{form.name}</span>
                <Link to={`/kapps/${kappSlug}/forms/${form.slug}`}>
                  submit new
                </Link>
                <Link to={`/kapps/${kappSlug}/forms/${form.slug}/submissions`}>
                  view submitted
                </Link>
              </span>
            </li>
          ))}
      </ul>
    </Fragment>
  ) : error ? (
    <pre>{JSON.stringify(error)}</pre>
  ) : (
    <WallySpinner />
  );
};
