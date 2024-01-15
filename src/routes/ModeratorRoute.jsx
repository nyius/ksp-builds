import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/auth/AuthContext';
import { db } from '../firebase.config';
import { getDoc, doc } from 'firebase/firestore';

/**
 * Handles navigation for admin routes
 * @param {*} param0
 * @returns
 */
function ModeratorRoute({ children }) {
	const { user, authLoading, isAuthenticated } = useAuthContext();
	const [verify, setVerify] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!authLoading) {
			if (user?.siteAdmin) {
				const checkUserForAdmin = async () => {
					const data = await getDoc(doc(db, 'admins', user.uid));
					if (data.exists()) {
						setVerify(true);
						setLoading(false);
					} else {
						setLoading(false);
					}
				};
				checkUserForAdmin();

				if (!verify) {
					const checkUserForMod = async () => {
						const data = await getDoc(doc(db, 'moderators', user.uid));
						if (data.exists()) {
							setVerify(true);
							setLoading(false);
						} else {
							setLoading(false);
						}
					};
				}
			} else {
				setLoading(false);
			}
		}
	}, [authLoading]);

	// Check if the page is for admins only, and if the user is admin
	if (!authLoading) {
		if (isAuthenticated) {
			if (!loading) {
				if (verify) {
					return <>{children}</>;
				} else {
					return <Navigate to="/" />;
				}
			}
		} else {
			return <Navigate to="/" />;
		}
	}
}

export default ModeratorRoute;
