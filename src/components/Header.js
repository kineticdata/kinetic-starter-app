import React, { useState } from 'react';
import { logout } from '@kineticdata/react';
import armyStar from '../assets/army_star.png';
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
  <header className="header">
    <div className="header-centered">
      <div className="header-logo-container">
        <Link to="/">
          <img src={armyStar} className="header-logo" alt="Kinetic Data logo" />
        </Link>
        <span className="header-title">Innovation Exchange</span>
      </div>
      <div className="header-nav">
        <Link className="header-link" to="/">
          <strong>Home</strong>
        </Link>
        <Link className="header-link" to="/">
          <strong>About</strong>
        </Link>
        <Link className="header-link" to="/opportunities">
          <strong>Opportunities</strong>
        </Link>
        <Link className="header-link" to="/">
          <strong>Media</strong>
        </Link>
        <Link className="header-link" to="/contact-us">
          <strong>Contact Us</strong>
        </Link>
        <Link className="header-link" to="/">
          <strong>Registration</strong>
        </Link>
        <Link className="header-logo-link" to="/">
          <i className="fa-brands fa-facebook-f" alt="Facebook logo" />
        </Link>
        <Link className="header-logo-link" to="/">
          <i className="fa-brands fa-x-twitter" alt="Twitter logo" />
        </Link>
        <Link className="header-logo-link" to="/">
          <i className="fa-brands fa-linkedin-in" alt="LinkedIn logo" />
        </Link>
      </div>
      {/* {loggedIn && (
        <div className="buttons">
          <HeaderDropdownMenu profile={profile} />
        </div>
      )} */}
    </div>
  </header>
);
