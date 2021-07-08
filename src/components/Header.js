import React, { useState } from 'react';
import { logout } from '@kineticdata/react';
import kineticLogo from '../assets/kinetic-logo.png';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownToggle, DropdownMenu, NavItem } from 'reactstrap';

// Dropdown menu with user info, link to profile page, and logout
const HeaderDropdownMenu = ({ profile }) => {
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <NavItem>
      <Dropdown isOpen={isOpen} toggle={toggle}>
        <DropdownToggle role="button">
          {/* <span className="fa fa-caret-down" /> */}
          {profile ? profile.displayName : 'Menu'}
        </DropdownToggle>
        <DropdownMenu right className="profile-menu">
          <div className="profile-header">
            <h6>
              {profile ? profile.displayName : 'Username'}
              <br />
              <small>{profile ? profile.email : 'Email'}</small>
            </h6>
          </div>
          <div className="profile-links">
            <Link to="/profile" className="dropdown-item" onClick={toggle}>
              View Profile
            </Link>
            <Link to="/" onClick={logout} className="dropdown-item">
              Logout
            </Link>
          </div>
        </DropdownMenu>
      </Dropdown>
    </NavItem>
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
