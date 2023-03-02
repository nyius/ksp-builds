import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/auth/AuthContext';

/**
 * Handles navigation for private routes
 * @param {*} param0
 * @returns
 */
function PrivateRoute({ children, admin }) {
	const { user, authLoading } = useContext(AuthContext);

	// Check if the page is for admins only, and if the user is admin
	if (admin) return authLoading ? '' : user ? user.siteAdmin ? <>{children}</> : <Navigate to="/" /> : <Navigate to="/login" />;

	// If the user is logged in, display children
	// Else, take them to login screen (/)
	return authLoading ? '' : user ? <>{children}</> : <Navigate to="/" />;
}

export default PrivateRoute;
