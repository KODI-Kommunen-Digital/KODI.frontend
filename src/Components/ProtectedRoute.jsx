import React from "react";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isAuthenticated, isOwner, children }) => {
    if (!isAuthenticated) {
        // If the user is not logged in, redirect them to the login page
        return <Navigate to="/login" />;
    }

    if (!isOwner) {
        // If the user is not an owner, redirect them to another page
        return <Navigate to="/Error" />;
    }

    // If the user is an owner, render the child components (the protected screens)
    return children;
};

// Add prop-types validation
ProtectedRoute.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    isOwner: PropTypes.bool.isRequired,   // Validate isOwner is a boolean and required
    children: PropTypes.node.isRequired,  // Validate children is a React node and required
};

export default ProtectedRoute;