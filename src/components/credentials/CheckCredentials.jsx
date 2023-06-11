import React, { useContext } from 'react';
import AuthContext from '../../context/auth/AuthContext';
import BuildContext from '../../context/build/BuildContext';

/**
 * Checks credentials (type) and retuns children if credentials are met
 * @param {string} type - user, admin, buildOwner
 * @param {*} children
 * @returns
 */
function CheckCredentials({ type, children }) {
	const { authLoading, user } = useContext(AuthContext);
	const { loadedBuild, loadingBuild } = useContext(BuildContext);

	if (!authLoading) {
		if (type === 'user' && user && user.username) {
			return children;
		} else if (type === 'admin' && user && user?.siteAdmin) {
			return children;
		} else if (type === 'buildOwner' && user && !loadingBuild && (user?.uid === loadedBuild.uid || user?.siteAdmin)) {
			return children;
		} else {
			return null;
		}
	} else {
		return null;
	}
}

export default CheckCredentials;
