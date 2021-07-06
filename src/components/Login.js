import React, { useCallback, useState } from 'react';
import { history } from '../index';
import { appLogout } from '../App';

export const Login = ({
  error,
  onChangePassword,
  onChangeUsername,
  onLogin,
  password,
  pending,
  redirect,
  username,
}) => {
  const redirectCallback = redirect ? () => history.push('/') : null;

  const onSubmit = useCallback(event => onLogin(event, redirectCallback), [
    onLogin,
    redirectCallback,
  ]);
  return (
    <div className="login__wrapper">
      <span>
        <h1>Login</h1>
        <form>
          {error && <div style={{ color: 'red' }}>{error}</div>}
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={onChangeUsername}
            value={username}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={onChangePassword}
            value={password}
          />
          <button disabled={pending} type="submit" onClick={onSubmit}>
            Login
          </button>
        </form>
      </span>
    </div>
  );
};
