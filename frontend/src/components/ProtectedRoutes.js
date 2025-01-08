import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        return (
            <div>
                {/* Navigate to ComponentB and pass props */}
                <Navigate to="/" state={{ isAuthenticated: true }} />
            </div>
        );
    }

    // If authenticated, render the children components
    return children;
};

export default ProtectedRoute;
