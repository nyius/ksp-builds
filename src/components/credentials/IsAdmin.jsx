import React, { useContext } from 'react';
import AuthContext from '../../context/auth/AuthContext';

/**
 * Returns the inner component if user is an admin
 * @returns
 */
function IsAdmin({ children }) {
	const { authLoading, user } = useContext(AuthContext);

	if (!authLoading && user && user?.siteAdmin) {
		return children;
	}
}

export default IsAdmin;
