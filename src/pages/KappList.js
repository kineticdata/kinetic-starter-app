import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { KappTable, fetchKapps } from '@kineticdata/react';
import { WallySpinner } from './Loading';

export const NameCell = ({ row }) => (
  <li>
    <Link to={`/kapps/${row.get('slug')}/forms`}>{row.get('name')}</Link>
  </li>
);

export const TableLayout = ({ body }) => body;

export const Body = ({ tableRows }) => <ul>{tableRows}</ul>;

export const BodyRow = ({ cells }) => cells;

export const KappList = props => {
  const [{ kapps, error }, setKapps] = useState({});

  useEffect(() => {
    if (!props.private) {
      fetchKapps({
        public: !props.private,
      }).then(setKapps);
    }
  }, [props.private]);

  return props.private ? (
    <KappTable
      alterColumns={{
        name: {
          components: {
            BodyCell: NameCell,
          },
        },
      }}
      components={{ TableLayout, Body, BodyRow }}
      columnSet={['name']}
      omitHeader={true}
    >
      {({ table }) => (
        <>
          <h1>Kapps</h1>
          <div>{table}</div>
        </>
      )}
    </KappTable>
  ) : kapps ? (
    <Fragment>
      <h1>Kapps</h1>
      <ul>
        {kapps.map(kapp => (
          <li key={kapp.slug}>
            <Link to={`/kapps/${kapp.slug}/forms`}>{kapp.name}</Link>
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
