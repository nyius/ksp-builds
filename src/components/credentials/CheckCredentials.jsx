import React, { useContext } from 'react';
import AuthContext from '../../context/auth/AuthContext';
import BuildContext from '../../context/build/BuildContext';

/**
 * Checks credentials (type) and retuns children if credentials are met
 * @param {string} type - user, admin, buildOwner, favorite, subscriber, notSubscribed, commentOwner, loggedOut
 * @param {string} uid - (optional) UID to check against (is current user === UID)
 * @param {*} children
 * @returns
 */
function CheckCredentials({ type, uid, children }) {
	const { authLoading, user } = useContext(AuthContext);
	const { loadedBuild, loadingBuild } = useContext(BuildContext);

	if (!authLoading) {
		if (type === 'user' && user && (user.username || user.siteAdmin)) {
			return children;
		} else if (type === 'admin' && user && user?.siteAdmin) {
			return children;
		} else if (type === 'buildOwner' && user && !loadingBuild && (user?.uid === loadedBuild.uid || user?.siteAdmin)) {
			return children;
		} else if (type === 'commentOwner' && user && (user.uid === uid || user?.siteAdmin)) {
			return children;
		} else if (type === 'favorite' && user && user?.favorites) {
			return children;
		} else if (type === 'subscriber' && user && user?.subscribed) {
			return children;
		} else if (type === 'notSubscribed' && user && !user?.subscribed) {
			return children;
		} else if (type === 'loggedOut' && !user?.username) {
			return children;
		}
	} else {
		return null;
	}
}

export default CheckCredentials;
