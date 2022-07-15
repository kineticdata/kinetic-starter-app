import React from 'react';
import tjbSeal from '../assets/tjb-seal.png';
import { Link } from 'react-router-dom';
import '../assets/styles/forms.css';

export const Header = () => (
  <header className="tjb-header">
    <Link to="/">
      <img src={tjbSeal} className="tjb-header-logo" alt="Texas Judicial Branch logo" />
    </Link>
    <h1 className="tjb-header-text">SMS Registration for Texas Judicial Branch</h1>
  </header>
);
