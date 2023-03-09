import React from 'react';
import { AuthProvider } from './auth/AuthContext';
import { FiltersProvider } from './filters/FiltersContext';
import { BuildsProvider } from './builds/BuildsContext';
import { BuildProvider } from './build/BuildContext';

/**
 * Stores all the contexts in one place
 * @param {*} param0
 * @returns
 */
function ContextsProvider({ children }) {
	return (
		<AuthProvider>
			<FiltersProvider>
				<BuildsProvider>
					<BuildProvider>{children}</BuildProvider>
				</BuildsProvider>
			</FiltersProvider>
		</AuthProvider>
	);
}

export default ContextsProvider;