import React, { createContext, useState, useEffect, useReducer } from 'react';
import { cloneDeep } from 'lodash';
import AuthReducer from './AuthReducer';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../firebase.config';
import { doc, getDoc, getDocs, collection, query, where, orderBy, limit, deleteDoc, onSnapshot } from 'firebase/firestore';

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
				const q = query(notificationsRef, orderBy('timestamp', 'desc', limit(process.env.REACT_APP_NOTIFS_FETCH_NUM)), limit(process.env.REACT_APP_NOTIFS_FETCH_NUM));

				const notificationsSnap = await getDocs(q);
				const notificationsList = notificationsSnap.docs.map(doc => {
					const notif = doc.data();
					notif.id = doc.id;
					return notif;
				});

				if (notificationsList) notificationsList.sort((a, b) => b.timestamp - a.timestamp); // Sort by timestamp

				let deleteNotifIds = [];

				// Filter the notifications based on blocked notids
				let filteredNotifications = notificationsList.filter(notif => {
					// Check if the user doesn't want any notifications, if so, delete them all instantly
					if (!user.notificationsAllowed) {
						// Delete all notifications
						notificationsList.forEach(notif => {
							// await deleteDoc(doc.ref);
							deleteNotifIds.push(notif.id);
						});
					} else {
						if (user.blockedNotifications?.includes(notif.type)) {
							deleteNotifIds.push(notif.id);
						} else {
							return notif;
						}
					}
				});

				user.notifications = filteredNotifications; // Set the notifs

				// Delete all the notifications that were filtered out
				deleteNotifIds.forEach(async id => {
					await deleteDoc(doc(db, 'users', auth.currentUser.uid, 'notifications', id));
				});

				// Fetch their Convos ----------------------------------------------------------------------------------------------------------------------------------//
				const convosRef = collection(db, 'conversations');
				const convosQ = query(convosRef, where('users', 'array-contains', auth.currentUser.uid));
				const convosSnap = await getDocs(convosQ);

				const convosList = await Promise.all(
					convosSnap.docs.map(async convoDoc => {
						const convo = convoDoc.data();
						convo.id = convoDoc.id;
						convo.lastMessage = new Intl.DateTimeFormat('en-US', { year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(convo.lastMessage.seconds * 1000);

						// Fetch the other users profile
						const userToFetch = convo.users.filter(user => {
							return user !== auth.currentUser.uid;
						})[0];

						const userFetch = await getDoc(doc(db, 'userProfiles', userToFetch));
						const userData = userFetch.data();
						convo.userProfilePic = userData.profilePicture;
						convo.username = userData.username;
						convo.messages = [];

						// Grab the convo from the logged in user and see if we have a new unread message
						const currentUserMessageFetch = await getDoc(doc(db, 'users', auth.currentUser.uid, 'messages', convo.id));
						const currentUserMessageData = currentUserMessageFetch.data();

						convo.newMessage = currentUserMessageData.newMessage;

						// Subscribe to the conversations messages so we can listen to  any new messages
						// This automatically grabs all messages from the DB upon listening
						const messagesQuery = collection(db, `conversations`, convo.id, 'messages');
						const unsubscribeMessage = onSnapshot(messagesQuery, querySnapshot => {
							querySnapshot.docChanges().forEach(change => {
								if (change.type === 'added') {
									let newMessage = change.doc.data();

									newMessage.timestamp = new Intl.DateTimeFormat('en-US', { year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(
										newMessage.timestamp ? newMessage.timestamp.seconds * 1000 : new Date()
									);

									dispatchAuth({
										type: 'NEW_MESSAGE',
										payload: newMessage,
									});
								}
							});
						});

						return convo;
					})
				);

				// Listen to current users messages to know if we get a new one -------------------------------------------------------------------------------------------------------------------------------------------------
				const userMessagesRef = collection(db, `users`, auth.currentUser.uid, 'messages');
				const userMessagesQuery = query(userMessagesRef, where('id', '!=', 'first'));
				const unsubscribeUserMessages = onSnapshot(userMessagesQuery, querySnapshot => {
					querySnapshot.docChanges().forEach(change => {
						if (change.type === 'added') {
							let newIncomingConvo = change.doc.data();

							dispatchAuth({
								type: 'INCOMING_NEW_CONVO',
								payload: newIncomingConvo,
							});
						} else if (change.type === 'modified') {
							let convo = change.doc.data();

							dispatchAuth({
								type: 'UPDATE_CONVO',
								payload: convo,
							});
						}
					});
				});

				dispatchAuth({
					type: 'SET_CONVOS',
					payload: convosList,
				});
				// Dispatch the user
				dispatchAuth({
					type: 'SET_USER',
					payload: user,
				});
				dispatchAuth({
					type: 'SET_AUTH',
					payload: { lastFetchedNotification: notificationsSnap.docs.length < process.env.REACT_APP_NOTIFS_FETCH_NUM ? 'end' : notificationsSnap.docs[notificationsSnap.docs.length - 1], notificationsLoading: false },
				});

				// if the user exists but they dont have a username, must be a new account so prompt for a new one
				if (!user.username) {
					console.log('No username!');
					dispatchAuth({ type: 'SET_NEW_SIGNUP', payload: true });
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
		editingProfile: false,
		cancelEditProfile: false,
		usernameChanged: false,
		verifyChangeUsername: false,
		newSignup: false,
		lastFetchedNotification: null,
		notificationsLoading: true,
		fetchingProfile: false,
		fetchedUserProfile: null,
		resetPasswordState: false,
		accountToDelete: null,
		reportingContent: null,
		reportType: '',
		messageTab: null,
		conversations: [],
		newConvo: null,
		hoverUser: null,
	};

	// Set up the reducer
	const [state, dispatchAuth] = useReducer(AuthReducer, initialState);

	// listen for new conversations to subscribe to
	useEffect(() => {
		if (state.newConvo) {
			let fetchedNewConvo;
			const fetchNewConvo = async () => {
				const newConvoData = await getDoc(doc(db, 'conversations', state.newConvo.id));

				if (newConvoData.exists()) {
					fetchedNewConvo = newConvoData.data();
					fetchedNewConvo.id = state.newConvo.id;

					// Fetch the other users profile
					const userToFetch = fetchedNewConvo.users.filter(user => {
						return user !== auth.currentUser.uid;
					})[0];

					const userFetch = await getDoc(doc(db, 'userProfiles', userToFetch));
					const userData = userFetch.data();

					fetchedNewConvo.userProfilePic = userData.profilePicture;
					fetchedNewConvo.username = userData.username;
					fetchedNewConvo.newMessage = true;
					fetchedNewConvo.messages = [];

					// Subscribe to the conversations messages so we can listen to  any new messages
					// This automatically grabs all messages from the DB upon listening
					const messagesQuery = collection(db, `conversations`, fetchedNewConvo.id, 'messages');
					const unsubscribeMessage = onSnapshot(messagesQuery, querySnapshot => {
						querySnapshot.docChanges().forEach(change => {
							if (change.type === 'added') {
								let newMessage = change.doc.data();

								newMessage.timestamp = new Intl.DateTimeFormat('en-US', { year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(
									newMessage.timestamp ? newMessage.timestamp.seconds * 1000 : new Date()
								);

								dispatchAuth({
									type: 'NEW_MESSAGE',
									payload: newMessage,
								});
							}
						});
					});
					return fetchedNewConvo;
				}
			};
			fetchNewConvo().then(fetchedNewConvo => {
				dispatchAuth({ type: 'NEW_CONVO', payload: fetchedNewConvo });
			});
		}
	}, [state.newConvo]);

	return <AuthContext.Provider value={{ ...state, dispatchAuth, authLoading }}>{children}</AuthContext.Provider>;
};

export default AuthContext;
