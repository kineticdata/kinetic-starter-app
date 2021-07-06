import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { KappTable } from '@kineticdata/react';
import { WallySpinner } from './Loading';

export const NameCell = ({ row }) => (
  <li>
    <Link to={`/kapps/${row.get('slug')}/forms`}>{row.get('name')}</Link>
  </li>
);

export const Body = ({ tableRows }) => <ul>{tableRows}</ul>;

export const KappList = props => {
  useEffect(() => {
    props.setCrumbs([]);
  }, [props.setCrumbs]);

  return (
    <KappTable
      alterColumns={{
        name: {
          components: {
            BodyCell: NameCell,
          },
        },
      }}
      components={{ Body }}
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
  );
};
