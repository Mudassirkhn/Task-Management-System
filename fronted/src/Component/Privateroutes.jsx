import React from 'react';
import { Navigate } from 'react-router-dom';

const Privateroutes = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default Privateroutes;
