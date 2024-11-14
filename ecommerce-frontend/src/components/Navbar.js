// src/components/Navbar.js

import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <h1>My E-Commerce</h1>
      <Link to="/">Home</Link>
      <Link to="/cart">Cart</Link>
      <Link to="/profile">Profile</Link>
    </nav>
  );
}

export default Navbar;
