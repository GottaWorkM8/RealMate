import { useAuth } from "contexts/AuthContext";
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const PublicRoute = ({ children }) => {
  let { currentUser } = useAuth();
  let location = useLocation();

  if (currentUser) {
    return <Navigate to="/" state={{ from: location }} />;
  }

  return children;
};

export default PublicRoute;
