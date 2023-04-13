import React, { createContext, useState, useEffect, useReducer } from 'react';
import { cloneDeep } from 'lodash';
import AuthReducer from './AuthReducer';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../firebase.config';
import { doc, getDoc, getDocs, collection, query, where, orderBy, limit, deleteDoc, onSnapshot } from 'firebase/firestore';
import fetchNotifications from '../../utilities/fetchNotifcations';
import fetchAllUserMessages from '../../utilities/fetchAllUserMessages';
import fetchAllUsersConvos from '../../utilities/fetchAllUsersConvos';
import fetchConvosMessages from '../../utilities/fetchConvosMessages';
import subscribeToUsersMessages from '../../utilities/subscribeToUsersMessages';
import subscribeToConvo from '../../utilities/subscribeToConvo';

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
				user.notifications = await fetchNotifications(user, dispatchAuth); // Set the notifs
				let usersConvos = await fetchAllUserMessages();
				let fetchedConvos = await fetchAllUsersConvos(usersConvos);

				await Promise.all(
					fetchedConvos.map(async convoDoc => {
						await fetchConvosMessages(convoDoc, dispatchAuth);
					})
				);

				// Listen to current users messages to know if we get a new one -------------------------------------------------------------------------------------------------------------------------------------------------
				await subscribeToUsersMessages(dispatchAuth);

				dispatchAuth({
					type: 'SET_CONVOS',
					payload: fetchedConvos,
				});
				// Dispatch the user
				dispatchAuth({
					type: 'SET_USER',
					payload: user,
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
		deleteConvoId: null,
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
					fetchedNewConvo.unsubscribe = await subscribeToConvo(fetchedNewConvo.id, dispatchAuth);

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
