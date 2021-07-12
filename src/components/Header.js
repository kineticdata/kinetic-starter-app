import React, { useState } from 'react';
import { logout } from '@kineticdata/react';
import kineticLogo from '../assets/kinetic-logo.png';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';

// Dropdown menu with user info, link to profile page, and logout
const HeaderDropdownMenu = ({ profile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <Dropdown isOpen={isOpen} toggle={toggle}>
      <DropdownToggle role="button" className="profile-menu-button">
        {/* <span className="fa fa-caret-down" /> */}
        {profile ? profile.displayName : 'Menu'}
      </DropdownToggle>
      <DropdownMenu
        right
        className={`profile-menu profile-menu-${isOpen ? 'open' : 'closed'}`}
      >
        <div className="profile-menu-header">
          <h5>
            {profile ? profile.displayName : 'Username'}
            <br />
            <small>{profile ? profile.email : 'Email'}</small>
          </h5>
        </div>
        <div className="profile-menu-links">
          <Link to="/profile" className="profile-menu-link" onClick={toggle}>
            View/Edit Profile
          </Link>
          <Link to="/" onClick={logout} className="profile-menu-link">
            Logout
          </Link>
        </div>
      </DropdownMenu>
    </Dropdown>
  );
};

export const Header = ({ space, loggedIn, profile }) => (
  <header className="public">
    <Link to="/">
      <img src={kineticLogo} className="header-logo" alt="Kinetic Data logo" />
    </Link>
    <h1>{space ? space.name : 'Public'}</h1>
    {loggedIn && (
      <div className="buttons">
        <HeaderDropdownMenu profile={profile} />
        {/* <button onClick={logout}>Logout</button> */}
      </div>
    )}
  </header>
);
