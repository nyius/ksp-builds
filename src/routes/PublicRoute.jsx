import React from 'react';
import { useAuthContext } from '../../../ksp2-builds/src/context/auth/AuthContext';
import { Navigate } from 'react-router-dom';

/**
 * Handles navigation for public routes (routes where the we dont want the logged in user to access)
 * @param {*} param0
 * @returns
 */
function PublicRoute({ children }) {
	const { user, authLoading } = useAuthContext();

	// If the user is logged in, take them away
	// Else, show them the children
	return authLoading ? '' : user ? <Navigate to="/" /> : <>{children}</>;
}

export default PublicRoute;
