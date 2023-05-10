import React, { useState } from 'react';
import { useCrumbs, useBridgedResource } from '../hooks';

export const Users = ({ authorized, setCrumbs }) => {
  const [bridgedResourceName, setBridgedResourceName] = useState('All Users');
  const [values, setValues] = useState({ Company: '' });

  const onChange = e => {
    setBridgedResourceName(e.target.value ? 'Users by Company' : 'All Users');
    setValues({ Company: e.target.value });
  };

  // fetch the list of kapps
  const records = useBridgedResource(
    'services',
    'shared-resources',
    bridgedResourceName,
    values,
  );

  // clear breadcrumbs on load
  useCrumbs({ setCrumbs });

  return (
    <>
      <h1>Users</h1>
      <div className="field">
        <select value={values.Company} onChange={onChange}>
          <option value=""></option>
          <option value="Kinetic Data">Kinetic Data</option>
          <option value="Other">Other</option>
          <option value="Not Kinetic Data">Not Kinetic Data</option>
        </select>
      </div>
      <table className="table" cellPadding={0} cellSpacing={0}>
        <thead>
          <tr>
            <th>Username</th>
            <th>Display Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {!records && (
            <tr>
              <td colSpan="3">Loading...</td>
            </tr>
          )}
          {records &&
            records.map(record => (
              <tr key={record.Username}>
                <td>{record.Username}</td>
                <td>{record['Display Name']}</td>
                <td>{record.Email}</td>
              </tr>
            ))}
          {records && records.length === 0 && (
            <tr>
              <td colSpan={authorized ? 3 : 2}>
                There are no users to display
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};
