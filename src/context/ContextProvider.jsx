import React from 'react';
import { AuthProvider } from './auth/AuthContext';

/**
 * Stores all the contexts in one place
 * @param {*} param0
 * @returns
 */
function ContextsProvider({ children }) {
	return <AuthProvider>{children}</AuthProvider>;
}

export default ContextsProvider;
