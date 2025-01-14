import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav style={{ background: '#333', color: '#fff', padding: '10px' }}>
      <Link to="/" style={{ margin: '0 10px', color: '#fff', textDecoration: 'none' }}>
        Home
      </Link>
      <Link to="/orders" style={{ margin: '0 10px', color: '#fff', textDecoration: 'none' }}>
        Orders
      </Link>
      <Link to="/consolidatedBook" style={{ margin: '0 10px', color: '#fff', textDecoration: 'none' }}>
        ConsolidatedBook
      </Link>
      <Link to="/register" style={{ margin: '0 10px', color: '#fff', textDecoration: 'none' }}>
        SignUp
      </Link>
      <Link to="/login" style={{ margin: '0 10px', color: '#fff', textDecoration: 'none' }}>
        Login
      </Link>
    </nav>
  );
};

export default Navigation;
