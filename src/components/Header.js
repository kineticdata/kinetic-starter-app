import React, { useEffect, useState } from 'react';
import { logout } from '@kineticdata/react';
import kineticLogo from '../assets/kinetic-logo.png';
import { Dropdown, DropdownToggle, DropdownMenu, NavItem } from 'reactstrap';

// Dropdown menu in progress
const HeaderDropdownMenu = ({}) => {
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <NavItem>
      <Dropdown isOpen={isOpen} toggle={toggle}>
        <DropdownToggle role="button">Header Dropdown</DropdownToggle>
        <DropdownMenu right className="profile-menu">
          <div className="profile-header">
            <h6>
              displayName
              <br />
              <small>email</small>
            </h6>
          </div>
          <div className="profile-links">
            <div className="dropdown-divider" role="none" />
            <a
              href="/profile"
              className="dropdown-item"
              onClick={toggle}
              role="menuitem"
            >
              <button>View Profile</button>
            </a>
            <div className="dropdown-divider" role="none" />
            <button onClick={logout} className="dropdown-item" role="menuitem">
              Logout
            </button>
          </div>
        </DropdownMenu>
      </Dropdown>
    </NavItem>
  );
};

export const Header = ({ space, loggedIn }) => (
  <header className="public">
    <img
      src={kineticLogo}
      className="header-logo"
      alt="Kinetic Data logo"
      onClick={() => console.log('clicked logo')}
    />
    <h1 onClick={() => console.log('clicked header')}>
      {space ? space.name : 'Public'}
    </h1>
    {loggedIn && (
      <div className="buttons">
        {/* <HeaderDropdownMenu /> */}
        <button onClick={logout}>Logout</button>
      </div>
    )}
  </header>
);
