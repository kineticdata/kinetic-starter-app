import React, { useCallback } from 'react';
import { history } from '../index';

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
  const onSubmit = useCallback(
    event => {
      const redirectCallback = redirect ? () => history.push('/') : null;

      return onLogin(event, redirectCallback);
    },
    [onLogin, redirect],
  );

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
