// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

interface ProtectedRouteProps {
  children?: React.ReactNode; // Add this line to specify that ProtectedRoute can have children
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoggedIn } = useSelector((state: any) => state.auth); // Accessing isLoggedIn from the state

  if (!isLoggedIn) {
    // If user is not logged in, redirect them to the login page
    return <Navigate to="/login" />;
  }

  return <>{children || <Outlet />}</>; // If logged in, render the child routes or Outlet
};

export default ProtectedRoute;
