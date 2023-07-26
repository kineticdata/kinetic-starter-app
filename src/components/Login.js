import React from 'react';

export const Login = ({
  error,
  onChangePassword,
  onChangeUsername,
  onSso,
  password,
  pending,
  username,
}) => {

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
          <button disabled={pending} type="submit" onClick={() => onSso()}>
            Login
          </button>
        </form>
      </span>
    </div>
  );
};
