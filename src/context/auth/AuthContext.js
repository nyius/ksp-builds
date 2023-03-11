import React, { createContext, useState, useEffect, useReducer } from 'react';
import AuthReducer from './AuthReducer';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../firebase.config';
import { doc, getDoc, getDocs, collection, query, where, orderBy, limit, deleteDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [authLoading, setAuthLoading] = useState(true);

	//Get the user from the database
	const getUser = async () => {
		try {
			// Get the user from the db
			const docRefUser = doc(db, 'users', auth.currentUser.uid);
			const docSnapUser = await getDoc(docRefUser).catch(err => {
				throw new Error(err);
			});

			// Check if the user exists
			if (docSnapUser.exists()) {
				const user = docSnapUser.data();

				// Fetch their notifications --------------------------------------------//
				const notificationsRef = collection(db, 'users', auth.currentUser.uid, 'notifications');
				const q = query(notificationsRef, orderBy('timestamp', 'desc', limit(20)), limit(20));

				const notificationsSnap = await getDocs(q);
				const notificationsList = notificationsSnap.docs.map(doc => {
					const notif = doc.data();
					notif.id = doc.id;
					return notif;
				});

				if (notificationsList) notificationsList.sort((a, b) => b.timestamp - a.timestamp); // Sort by timestamp

				let deleteNotifIds = [];

				let filteredNotifications = notificationsList
					.filter(notif => {
						// Check if the user doesn't want any notifications, if so, delete them all instantly
						if (!user.notificationsAllowed) {
							// Delete all notifications
							notificationsList.forEach(notif => {
								// await deleteDoc(doc.ref);
								deleteNotifIds.push(notif.id);
							});
						} else {
							return notif;
						}
					})
					.filter(notif => {
						if (!user.commentNotificationsAllowed && notif.type == 'comment') {
							deleteNotifIds.push(notif.id);
							return false;
						}
						return notif;
					});

				user.notifications = filteredNotifications; // Set the notifs

				// Dispatch the user
				dispatchAuth({
					type: 'SET_USER',
					payload: user,
				});

				// Delete all the notifications that were filtered out
				deleteNotifIds.forEach(async id => {
					await deleteDoc(doc(db, 'users', auth.currentUser.uid, 'notifications', id));
				});

				// if the user exists but they dont have a username, must be a new account so prompt for a new one
				if (!user.username) {
					console.log('No username!');
					dispatchAuth({ type: 'SET_NEW_SIGNUP', payload: true });
				} else {
					//
				}
			} else {
				throw new Error('User does not exist');
			}
		} catch (error) {
			console.log(error);
		}
	};

	// Listen for login/logout
	useEffect(() => {
		onAuthStateChanged(auth, () => {
			setAuthLoading(true);
			if (auth.currentUser) {
				dispatchAuth({
					type: 'LOGIN',
					payload: auth.currentUser,
				});
				getUser().then(() => setAuthLoading(false));
			} else {
				dispatchAuth({
					type: 'LOGOUT',
					payload: null,
				});

				setAuthLoading(false);
			}
		});
	}, []);

	// Init state
	const initialState = {
		user: null,
		newUsername: '',
		newBio: '',
		editingProfile: false,
		cancelEditProfile: false,
		usernameChanged: false,
		verifyChangeUsername: false,
		newSignup: false,
		fetchingProfile: false,
		fetchedUserProfile: null,
		resetPasswordState: false,
	};

	// Set up the reducer
	const [state, dispatchAuth] = useReducer(AuthReducer, initialState);

	return <AuthContext.Provider value={{ ...state, dispatchAuth, authLoading }}>{children}</AuthContext.Provider>;
};

export default AuthContext;
