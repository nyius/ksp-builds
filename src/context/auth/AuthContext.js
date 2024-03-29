import React, { createContext, useState, useEffect, useReducer, useContext } from 'react';
import AuthReducer from './AuthReducer';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../firebase.config';
import { doc, getDoc, increment, onSnapshot, serverTimestamp } from 'firebase/firestore';
import fetchNotifications from '../../utilities/fetchNotifcations';
import fetchAllUserMessages from '../../utilities/fetchAllUserMessages';
import fetchAllUsersConvos from '../../utilities/fetchAllUsersConvos';
import fetchConvosMessages from '../../utilities/fetchConvosMessages';
import subscribeToUsersMessages from '../../utilities/subscribeToUsersMessages';
import subscribeToConvo from '../../utilities/subscribeToConvo';
import { checkLocalBuildAge } from '../build/BuildUtils';
import errorReport from '../../utilities/errorReport';
import isMoreThanOneDayOlder from '../../utilities/isMoreThanOneDayOlder';
import { updateUserProfilesAndDb } from './AuthUtils';
import subscribeToUsersNotifications from '../../utilities/subscribeToUsersNotifications';

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
				setAuthLoading(false);
				// Dispatch the user
				dispatchAuth({
					type: 'SET_USER',
					payload: user,
				});

				// if the user exists but they dont have a username, must be a new account so prompt for a new one
				if (!user.username) {
					dispatchAuth({ type: 'SET_NEW_SIGNUP', payload: true });
					setAuthLoading(false);
				}

				let notifications = await fetchNotifications(user, dispatchAuth);
				dispatchAuth({
					type: 'UPDATE_USER',
					payload: { notifications },
				});

				let usersConvos = await fetchAllUserMessages();
				let fetchedConvos = await fetchAllUsersConvos(usersConvos);
				const filteredConvos = fetchedConvos?.filter(convo => !user?.blockList?.includes(convo.otherUser));
				await Promise.all(
					filteredConvos?.map(async convoDoc => {
						await fetchConvosMessages(convoDoc, dispatchAuth);
					})
				);

				// Listen to current users messages to know if we get a new one -------------------------------------------------------------------------------------------------------------------------------------------------
				await subscribeToUsersMessages(dispatchAuth);
				await subscribeToUsersNotifications(dispatchAuth);

				// Listen to current user -----------------------------------------
				const unsubUserSnap = onSnapshot(doc(db, 'users', auth.currentUser.uid), userListenData => {
					const userChanged = userListenData.data();

					if (!user?.subscribed && userChanged?.subscribed) {
						console.log('User subscribed.');
						dispatchAuth({
							type: 'UPDATE_USER',
							payload: {
								subscribed: userChanged?.subscribed,
							},
						});
						dispatchAuth({
							type: 'SET_AUTH',
							payload: {
								newSub: true,
							},
						});
					}
				});

				dispatchAuth({
					type: 'SET_CONVOS',
					payload: filteredConvos,
				});
			} else {
				setAuthLoading(false);
				throw new Error('User does not exist');
			}
		} catch (error) {
			if (error.message.includes('User does not exist') || error.message.includes('client is offline')) {
				errorReport(error.message, false, 'getUser');
			} else if (window.location.href !== 'https://kspbuilds.com/sign-up') {
				errorReport(error.message, true, 'getUser');
			}
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
				getUser();
			} else {
				dispatchAuth({
					type: 'LOGOUT',
					payload: null,
				});

				setAuthLoading(false);
			}
		});
	}, []);

	// Fetch any site alerts
	useEffect(() => {
		const fetchSiteAlerts = async () => {
			try {
				const data = await getDoc(doc(db, 'kspInfo', 'alert'));
				const alert = data.data();

				dispatchAuth({
					type: 'SET_AUTH',
					payload: { alert, alertLoading: false },
				});
			} catch (error) {
				if (error.message !== 'Failed to get document because the client is offline.') {
					errorReport(error.message, true, 'fetchSiteAlerts');
				} else {
					errorReport(error.message, false, 'fetchSiteAlerts');
				}
			}
		};

		fetchSiteAlerts();
	}, []);

	// Init state
	const initialState = {
		user: null,
		newUsername: '',
		editingEmail: false,
		verifyEditedEmail: null,
		isAuthenticated: false,
		editingBio: false,
		cancelEditProfile: false,
		usernameChanged: false,
		verifyChangeUsername: false,
		newSignup: false,
		lastFetchedNotification: null,
		notificationsLoading: true,
		fetchingProfile: false,
		fetchedUserProfile: null,
		openProfile: null,
		fetchedUserProfiles: [],
		resetPasswordState: false,
		accountToDelete: null,
		reportingContent: null,
		reportType: '',
		messageTab: null,
		conversations: [],
		newConvo: null,
		hoverUser: null,
		deleteConvoId: null,
		userToBlock: null,
		newSub: false,
		convosOpen: false,
		convosLoading: true,
		subscribeModal: false,
		alert: null,
		alertLoading: true,
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

					const otherUser = fetchedNewConvo.users.filter(user => user !== auth.currentUser.uid)[0];

					// Check if we have the other user in this conversation blocked
					if (!state.user?.blockList?.includes(otherUser)) {
						// Fetch the other users profile
						const userToFetch = fetchedNewConvo.users.filter(user => {
							return user !== auth.currentUser.uid;
						})[0];

						const userFetch = await getDoc(doc(db, 'userProfiles', userToFetch));
						const userData = userFetch.data();

						fetchedNewConvo.userProfilePic = userData.profilePicture;
						fetchedNewConvo.username = userData.username;
						fetchedNewConvo.uid = userToFetch;
						fetchedNewConvo.newMessage = true;
						fetchedNewConvo.messages = [];

						// Subscribe to the conversations messages so we can listen to  any new messages
						fetchedNewConvo.unsubscribe = await subscribeToConvo(fetchedNewConvo.id, dispatchAuth);
					} else {
						fetchedNewConvo = 'blocked';
					}

					return fetchedNewConvo;
				}
			};
			fetchNewConvo().then(fetchedNewConvo => {
				if (fetchedNewConvo !== 'blocked') {
					dispatchAuth({ type: 'NEW_CONVO', payload: fetchedNewConvo });
				}
			});
		}
	}, [state.newConvo]);

	// Loop over users and remove any that are older than 30 days
	useEffect(() => {
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			const value = localStorage.getItem(key);

			if (!value) return;

			if (value.includes(`"type":"userProfile"`)) {
				let user = JSON.parse(value);

				if (checkLocalBuildAge(user.lastFetchedTimestamp, 43200)) {
					localStorage.removeItem(key);
				}
			}
		}
	}, []);

	// Log once a day website visit
	useEffect(() => {
		if (!authLoading && state.user) {
			if (state.user.lastVisit?.seconds) {
				const isOlder = isMoreThanOneDayOlder(state.user.lastVisit?.seconds);
				if (isOlder) {
					updateUserProfilesAndDb(dispatchAuth, { lastVisit: serverTimestamp(), dailyVisits: increment(1) }, state.user);
				}
			}
		}
	}, [authLoading, state.user]);

	return <AuthContext.Provider value={{ ...state, dispatchAuth, authLoading }}>{children}</AuthContext.Provider>;
};

/**
 * Auth Context
 * @returns
 */
export const useAuthContext = () => {
	const context = useContext(AuthContext);

	return context;
};

export default AuthContext;
