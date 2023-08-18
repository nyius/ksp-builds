import { db } from '../../firebase.config';
import { updateDoc, doc, getDoc, collection, deleteDoc, query, getDocs, serverTimestamp, setDoc, addDoc, limit, orderBy, startAfter, where, increment } from 'firebase/firestore';
import { signInWithPopup, createUserWithEmailAndPassword, updateEmail } from 'firebase/auth';
import { googleProvider } from '../../firebase.config';
import { auth } from '../../firebase.config';
import { cloneDeep } from 'lodash';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { checkMatchingEmails, fetchUserProfileFromServer, sendNotification } from './AuthUtils';
//---------------------------------------------------------------------------------------------------//
import { useAuthContext } from './AuthContext';
import { useBuildContext } from '../build/BuildContext';
import { updateWeeklyUpvoted } from './AuthUtils';
//---------------------------------------------------------------------------------------------------//
import standardUser from '../../utilities/standardUser';
import standardNotifications from '../../utilities/standardNotifications';
import standardUserProfile from '../../utilities/standardUserProfile';
import draftJsToPlainText from '../../utilities/draftJsToPlainText';
import subscribeToConvo from '../../utilities/subscribeToConvo';
import { checkLocalUserAge, getUserFromLocalStorage, setLocalStoredUser } from '../../utilities/userLocalStorage';
import { useEffect, useState } from 'react';
import { createDateFromFirebaseTimestamp } from '../../utilities/createDateFromFirebaseTimestamp';
import errorReport from '../../utilities/errorReport';

const useAuth = () => {
	const { dispatchAuth } = useAuthContext();

	/**
	 * Handles creating a new users account on the DB. Sets up a 'users' doc, a 'usersProfile' doc, and their 'notifications' doc.
	 * We havent set up username yet as that comes after initial setup.
	 * @param {string} name
	 * @param {string} email
	 * @param {string} uid
	 */
	const createNewUserAccount = async (name, email, uid) => {
		try {
			// If the user doesn't exist, create them in the DB
			let user = cloneDeep(standardUser);
			let notification = cloneDeep(standardNotifications);
			let userProfile = cloneDeep(standardUserProfile);
			const createdAt = serverTimestamp();
			const notifId = uuidv4().slice(0, 20);

			user.name = name;
			user.email = email;
			user.dateCreated = createdAt;

			notification.type = 'welcome';
			notification.username = 'nyius';
			notification.uid = 'ZyVrojY9BZU5ixp09LftOd240LH3';
			notification.timestamp = createdAt;
			notification.read = false;
			notification.profilePicture = 'https://firebasestorage.googleapis.com/v0/b/kspbuilds.appspot.com/o/selfie.png?alt=media&token=031dfd32-5038-4c84-96c3-40b09c0e4529';
			notification.message =
				'{"blocks":[{"key":"87rfs","text":"Welcome to KSP Builds! Please feel free to reach out with any questions/comments/ideas, and fly safe!","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":94,"style":"fontsize-14"}],"entityRanges":[],"data":{}}],"entityMap":{}}';

			userProfile.dateCreated = createdAt;

			const firstDoc = {
				id: 'first',
			};

			await setDoc(doc(db, 'users', uid), user);
			await setDoc(doc(db, 'users', uid, 'notifications', notifId), notification);
			await setDoc(doc(db, 'users', uid, 'messages', 'first'), firstDoc);
			await setDoc(doc(db, 'userProfiles', uid), userProfile);

			const statsData = await getDoc(doc(db, 'adminPanel', 'stats'));
			const stats = statsData.data();
			await updateDoc(doc(db, 'adminPanel', 'stats'), { users: (stats.users += 1) });

			notification.id = notifId;

			updateUserState(dispatchAuth, {
				notifications: [notification],
			});
		} catch (error) {
			errorReport(error.message, true, 'createNewUserAccount');
		}
	};

	/**
	 * handles logging in with Google
	 */
	const loginWithGoogle = async () => {
		try {
			const userCredential = await signInWithPopup(auth, googleProvider);

			// Get user information.
			const uid = userCredential.user.uid;
			const name = userCredential.user.displayName;
			const email = userCredential.user.email;
			const createdAt = serverTimestamp();

			const userRef = doc(db, 'users', uid);
			const userSnap = await getDoc(userRef);

			// Check if the user exists
			if (userSnap.exists()) {
				return 'success';
			} else {
				setNewSignup(dispatchAuth, true);
				createNewUserAccount(name, email, uid, createdAt);
			}
		} catch (error) {
			errorReport(error.message, true, 'loginWithGoogle');
			toast.error('Something went wrong. Please try again');
		}
	};

	/**
	 * Handles creating a new email account
	 * @param {obj} newUser - takes in the formdata for a new user
	 */
	const newEmailAccount = async newUser => {
		try {
			const userCredential = await createUserWithEmailAndPassword(auth, newUser.email, newUser.password).catch(err => {
				if (err.code.includes('already-in-use')) {
					toast.error('Account already exists!');
					throw new Error('exists');
				}
				return;
			});

			if (!userCredential) {
				toast.error('Something went wrong. Please check your email/password and try again!');
				return;
			}

			const email = userCredential.user.email;
			const uid = userCredential.user.uid;
			const name = '';
			const createdAt = serverTimestamp();

			setNewSignup(dispatchAuth, true);
			createNewUserAccount(name, email, uid, createdAt);
		} catch (error) {
			errorReport(error.message, true, 'newEmailAccount');
			return error;
		}
	};

	return {
		createNewUserAccount,
		loginWithGoogle,
		newEmailAccount,
	};
};

export default useAuth;

/**
 * Hook with functions for fetching profiles
 * @returns
 */
export const useFetchUser = () => {
	const { dispatchAuth, fetchedUserProfiles, user } = useAuthContext();
	/**
	 * Handles fetching a profile. First checks the local storage, then the server.
	 * Stores the result in the auth context
	 * @param {string} id - the id of the user to fetch
	 * @param {set function} setLoading - (optional) - a setter function for a loading state
	 * @returns the found user
	 */
	const fetchUsersProfile = async (id, setLoading) => {
		try {
			setLoading ? setLoading(true) : setFetchingProfile(dispatchAuth, true);

			let localUser = getUserFromLocalStorage(id);

			if (localUser) {
				if (checkLocalUserAge(localUser.lastFetchedTimestamp, process.env.REACT_APP_CACHE_TIMEOUT)) {
					const fetchedUser = await handleFetchUserProfileFromServer(id, setLoading);
					setFetchedUserProfiles(dispatchAuth, localUser, fetchedUserProfiles);
					return fetchedUser;
				} else {
					setFetchedUserProfiles(dispatchAuth, localUser, fetchedUserProfiles);
					setLoading ? setLoading(false) : setFetchingProfile(dispatchAuth, false);
					return localUser;
				}
			} else {
				const fetchedUser = await handleFetchUserProfileFromServer(id, setLoading);
				setFetchedUserProfiles(dispatchAuth, localUser, fetchedUserProfiles);
				return fetchedUser;
			}
		} catch (error) {
			errorReport(error.message, false, 'fetchUsersProfile');
			return null;
		}
	};

	/**
	 * Fetches a user from the server
	 * @param {string} id - the uid/username to fetch
	 * @param {set function} setLoading - a loading state (optional)
	 * @returns
	 */
	const handleFetchUserProfileFromServer = async (id, setLoading) => {
		try {
			const fetchedProfile = await fetchUserProfileFromServer(id);

			if (fetchedProfile) {
				setLocalStoredUser(fetchedProfile.uid, fetchedProfile);
				setLoading ? setLoading(false) : setFetchingProfile(dispatchAuth, false);
				return fetchedProfile;
			} else {
				setLoading ? setLoading(false) : setFetchingProfile(dispatchAuth, false);
				throw new Error(`Couldn't find profile`);
			}
		} catch (error) {
			errorReport(error.message, false, 'handleFetchUserProfileFromServer');
			return null;
		}
	};

	/**
	 * Checks if a user is in the 'fetchedUserProfiles' arr in the context
	 * @param {string} usersId - the users UID or username to find
	 * @returns
	 */
	const checkIfUserInContext = usersId => {
		let foundProfile;
		for (let i = 0; i < fetchedUserProfiles.length; i++) {
			if (fetchedUserProfiles[i].uid === usersId || fetchedUserProfiles[i].username === usersId) {
				foundProfile = fetchedUserProfiles[i];
				break;
			}
		}
		return foundProfile;
	};

	return { fetchUsersProfile, checkIfUserInContext };
};
/**
 * Hook with functions to handle voting on builds
 * @returns
 */
export const useHandleVoting = () => {
	const { user, isAuthenticated } = useAuthContext();
	const { updateUserDb, updateUserProfilesAndDb } = useUpdateProfile();

	/**
	 * Handles updating the users voting on the server. Updates the builds vote count and the current users voted
	 * @param {string} type - the type of vote. 'upVote' or 'downVote'
	 * @param {obj} build - the build to vote on
	 */
	const handleVoting = async (type, build) => {
		try {
			if (!isAuthenticated) return;
			let newUpVotes = cloneDeep(user.upVotes);
			let newDownVotes = cloneDeep(user.downVotes);

			if (type === 'upVote') {
				if (newUpVotes.includes(build.id)) {
					// If you clicked upvote and already have the build upvoted, remove it
					const index = newUpVotes.indexOf(build.id);
					newUpVotes.splice(index, 1);

					await updateUserDb({ upVotes: newUpVotes });
					await updateDoc(doc(db, process.env.REACT_APP_BUILDSDB, build.id), { upVotes: (build.upVotes -= 1), lastModified: serverTimestamp() });
					await updateUserProfilesAndDb({ rocketReputation: increment(-1) }, build.uid);
					await updateWeeklyUpvoted(build.id, 'remove', user.uid);
				} else {
					// If you clicked upvote and you dont have it upvoted
					newUpVotes.push(build.id);
					let usersUpdates = { upVotes: newUpVotes };
					let buildAuthorUpdates = { rocketReputation: increment(1) };
					let buildUpdates = { upVotes: (build.upVotes += 1), lastModified: serverTimestamp() };

					if (build.uid !== user.uid) {
						await updateWeeklyUpvoted(build.id, 'add', user.uid);
					}

					if (newDownVotes.includes(build.id)) {
						// If the user has this downvoted but wants to upvote it, remove the downvote
						const index = newDownVotes.indexOf(build.id);
						newDownVotes.splice(index, 1);
						usersUpdates.downVotes = newDownVotes;
						buildUpdates.downVotes = build.downVotes -= 1;
					}

					await updateUserDb(usersUpdates);
					await updateDoc(doc(db, process.env.REACT_APP_BUILDSDB, build.id), buildUpdates);
					await updateUserProfilesAndDb(buildAuthorUpdates, build.uid);
				}
			}

			if (type === 'downVote') {
				if (newDownVotes.includes(build.id)) {
					// If we already have it downvoted and we clicked downvote, remove the downvote
					const index = newDownVotes.indexOf(build.id);
					newDownVotes.splice(index, 1);

					await updateUserDb({ downVotes: newDownVotes });
					await updateDoc(doc(db, process.env.REACT_APP_BUILDSDB, build.id), { downVotes: (build.downVotes -= 1), lastModified: serverTimestamp() });
					await updateUserProfilesAndDb({ rocketReputation: increment(1) }, build.uid);
				} else {
					// If you clicked downvote and you dont have it down voted
					newDownVotes.push(build.id);
					let usersUpdates = { downVotes: newDownVotes };
					let buildAuthorUpdates = { rocketReputation: increment(-1) };
					let buildUpdates = { downVotes: (build.downVotes += 1), lastModified: serverTimestamp() };

					if (build.uid !== user.uid) {
						await updateWeeklyUpvoted(build.id, 'remove', user.uid);
					}

					// If the user has this upvoted but wants to downvote it, remove the upvote
					if (newUpVotes.includes(build.id)) {
						const index = newUpVotes.indexOf(build.id);
						newUpVotes.splice(index, 1);
						usersUpdates.upVotes = newUpVotes;
						buildUpdates.upVotes = build.upVotes -= 1;
					}

					await updateUserDb(usersUpdates);
					await updateDoc(doc(db, process.env.REACT_APP_BUILDSDB, build.id), buildUpdates);
					await updateUserProfilesAndDb(buildAuthorUpdates, build.uid);
				}
			}
		} catch (error) {
			errorReport(error.message, true, 'handleVoting');
			toast.error('Something went wrong D:');
		}
	};

	return { handleVoting };
};
/**
 * Hook with functions for updating a users profile
 * @returns
 */
export const useUpdateProfile = () => {
	const { user, dispatchAuth, editingEmail, verifyEditedEmail } = useAuthContext();
	/**
	 * Handles updating the users profile picture on the server and context
	 * @param {*} profilePicture
	 */
	const updateUserProfilePic = async profilePicture => {
		try {
			updateUserProfilesAndDb({ profilePicture, lastModified: serverTimestamp() });
			updateUserState(dispatchAuth, { profilePicture });
			toast.success('Profile Picture updated!');
		} catch (error) {
			errorReport(error.message, true, 'updateUserProfilePic');
			toast.error('Something went wrong. Please try again');
		}
	};

	/**
	 * Handles updating the users bio on the server and context
	 * @param {string} bio - the new bio to set
	 */
	const updateUserBio = async bio => {
		try {
			updateUserProfilesAndDb({ bio, lastModified: serverTimestamp() });
			updateUserState(dispatchAuth, { bio });
			toast.success('Bio updated!');
		} catch (error) {
			errorReport(error.message, true, 'updateUserBio');
			toast.error('Something went wrong. Please try again');
		}
	};

	/**
	 * Handles updating the users bio on the server and context
	 * @param
	 */
	const updateUserEmail = async () => {
		try {
			if (!checkMatchingEmails(editingEmail, verifyEditedEmail)) {
				toast.error("New emails don't match!");
				return;
			}
			updateEmail(auth.currentUser, editingEmail);
			updateUserDb({ email: editingEmail, lastModified: serverTimestamp() });
			updateUserState(dispatchAuth, { email: editingEmail });
			toast.success('Email updated!');
		} catch (error) {
			errorReport(error.message, true, 'updateUserEmail');
			toast.error('Something went wrong. Please try again');
		}
	};

	/**
	 * Handles updating the user on the DB. Also updates state
	 * @param {obj} update - The object with updates
	 * @param {string} userUid - The uid of the user to update. If null, uses logged in user
	 */
	const updateUserDb = async (update, userUid) => {
		try {
			if (!userUid) {
				if (update.rocketReputation?.wa) {
					update.rocketReputation = user.rocketReputation += update.rocketReputation.wa;
					updateUserState(dispatchAuth, { ...update });
					setLocalStoredUser(user.uid, user);
				} else {
					updateUserState(dispatchAuth, { ...update });
					setLocalStoredUser(user.uid, user);
				}
			}
			if (userUid && userUid === user.uid) {
				if (update.rocketReputation?.wa) {
					update.rocketReputation = user.rocketReputation += update.rocketReputation.wa;
					updateUserState(dispatchAuth, { ...update });
					setLocalStoredUser(user.uid, user);
				} else {
					updateUserState(dispatchAuth, { ...update });
					setLocalStoredUser(user.uid, user);
				}
			}
			await updateDoc(doc(db, 'users', userUid ? userUid : user.uid), update);
		} catch (error) {
			errorReport(error.message, true, 'updateUserDb');
			toast.error('Something went wrong. Please try again');
		}
	};

	/**
	 * handles updating a users public profile
	 * @param {obj} update - the object with updates
	 * @param {string} userUid - The uid of the user to update. If null, uses logged in user
	 */
	const updateUserProfiles = async (update, userUid) => {
		try {
			await updateDoc(doc(db, 'userProfiles', userUid ? userUid : user.uid), update);
		} catch (error) {
			errorReport(error.message, true, 'updateUserProfiles');
		}
	};

	/**
	 * Handles updating a users DB and userProfile at the same time.
	 * Also Updates the user state
	 * @param {obj} update - Takes in the update
	 * @param {string} userUid - The uid of the user to update. If null, uses logged in user
	 */
	const updateUserProfilesAndDb = async (update, userUid) => {
		try {
			await updateUserDb(update, userUid ? userUid : user.uid);
			await updateUserProfiles(update, userUid ? userUid : user.uid);
		} catch (error) {
			errorReport(error.message, true, 'updateUserProfilesAndDb');
		}
	};

	return { updateUserProfilePic, updateUserBio, updateUserDb, updateUserProfilesAndDb, updateUserEmail };
};

/**
 * Hook with functions for notifications
 */
export const useHandleNotifications = () => {
	const { user, dispatchAuth, lastFetchedNotification } = useAuthContext();
	/**
	 * Handles deleting all of a users notifications
	 * @returns
	 */
	const handleDeleteAllNotifications = async () => {
		try {
			user.notifications.map(notif => {
				const deleteNotif = async () => {
					await deleteDoc(doc(db, 'users', user.uid, 'notifications', notif.id));
				};
				deleteNotif();
			});
			setNotifications(dispatchAuth, []);
		} catch (error) {
			errorReport(error.message, true, 'handleDeleteAllNotifications');
			return;
		}
	};

	/**
	 * handles deleting a notification
	 * @param {int} index - index position
	 * @param {string} id - notification of the id to delete
	 */
	const handleDeleteNotification = async (index, id) => {
		try {
			let newNotifs = cloneDeep(user.notifications);
			newNotifs.splice(index, 1);

			await deleteDoc(doc(db, 'users', user.uid, 'notifications', id));
			setNotifications(dispatchAuth, newNotifs);
		} catch (error) {
			errorReport(error.message, true, 'handleDeleteNotification');
		}
	};

	/**
	 * Handles fetching more notifications
	 */
	const fetchMoreNotifications = async () => {
		try {
			dispatchAuth({
				type: 'SET_AUTH',
				payload: { notificationsLoading: true },
			});

			const notificationsRef = collection(db, 'users', auth.currentUser.uid, 'notifications');
			const q = query(notificationsRef, orderBy('timestamp', 'desc', limit(process.env.REACT_APP_NOTIFS_FETCH_NUM)), startAfter(lastFetchedNotification), limit(process.env.REACT_APP_NOTIFS_FETCH_NUM));

			const notifsSnap = await getDocs(q);
			let notifs = [];
			notifsSnap.forEach(doc => {
				const notif = doc.data();
				notifs.push(notif);
			});

			setNotifications(dispatchAuth, [...user.notifications, ...notifs]);
			dispatchAuth({
				type: 'SET_AUTH',
				payload: { lastFetchedNotification: notifsSnap.docs.length < process.env.REACT_APP_NOTIFS_FETCH_NUM ? 'end' : notifsSnap.docs[notifsSnap.docs.length - 1], notificationsLoading: false },
			});
		} catch (error) {
			errorReport(error.message, true, 'fetchMoreNotifications');
		}
	};

	/**
	 * Handles setting notifications as 'read' on the DB and in the state
	 */
	const setNotificationsRead = async () => {
		try {
			let newNotifs = [];

			await user.notifications.map(notif => {
				if (!notif.read) {
					const updateNotif = async () => {
						notif.read = true;
						newNotifs.push(notif);
						await updateDoc(doc(db, 'users', user.uid, 'notifications', notif.id), notif);
					};

					updateNotif();
				} else {
					newNotifs.push(notif);
				}
			});

			setNotifications(dispatchAuth, newNotifs);
		} catch (error) {
			errorReport(error.message, true, 'setNotificationsRead');
		}
	};

	return { handleDeleteAllNotifications, handleDeleteNotification, fetchMoreNotifications, setNotificationsRead };
};

/**
 * Hook with functions for deleting a conversation
 * @returns
 */
export const useDeleteConversation = () => {
	const { user, dispatchAuth, conversations } = useAuthContext();
	/**
	 * Handles removing a conversation from a user. Doesn't delete the actual conversation
	 * @param {string} id - id of the convo to delete
	 */
	const deleteConversation = async id => {
		try {
			// Delete the convo from the users messages
			await deleteDoc(doc(db, 'users', user.uid, 'messages', id));
			const convos = conversations.filter(convo => {
				if (convo.id !== id) {
					convo.unsubscribe();
				}
				return convo.id !== id;
			});
			// remove it from the conversations list
			dispatchAuth({
				type: 'SET_CONVOS',
				payload: convos,
			});
			toast.success('Conversation Removed.');
		} catch (error) {
			errorReport(error.message, true, 'deleteConversation');
		}
	};

	return { deleteConversation };
};
/**
 * Hook with functions to handle submitting a report
 * @returns
 */
export const useSubmitReport = () => {
	const { dispatchAuth, user, reportType, reportingContent, isAuthenticated } = useAuthContext();
	const { loadedBuild } = useBuildContext();

	/**
	 * Handles submitting a report. Takes in an optional message
	 * * @param {*} message
	 */
	const submitReport = async message => {
		try {
			if (reportType === 'comment') {
				const report = {
					reportedComment: draftJsToPlainText(reportingContent.comment),
					date: serverTimestamp(),
					reportedUsername: reportingContent.username,
					reportedUid: reportingContent.uid,
					reportedCommentId: reportingContent.id,
					buildId: loadedBuild.id,
					message: message ? message : '',
					type: 'comment',
				};

				if (isAuthenticated) {
					report.username = user.username;
					report.uid = user.uid;
				} else {
					report.username = 'Anonymous';
				}

				await addDoc(collection(db, 'reports'), report);
			} else if (reportType === 'build') {
				const report = {
					reportedBuild: reportingContent.name,
					date: serverTimestamp(),
					reportedUsername: reportingContent.author,
					reportedUid: reportingContent.uid,
					buildId: loadedBuild.id,
					message: message ? message : '',
					type: 'build',
				};

				if (isAuthenticated) {
					report.username = user.username;
					report.uid = user.uid;
				} else {
					report.username = 'Anonymous';
				}

				await addDoc(collection(db, 'reports'), report);
			} else if (reportType === 'user') {
				const report = {
					date: serverTimestamp(),
					reportedUsername: reportingContent.username,
					reportedUid: reportingContent.uid,
					message: message ? message : '',
					type: 'user',
				};

				if (isAuthenticated) {
					report.username = user.username;
					report.uid = user.uid;
				} else {
					report.username = 'Anonymous';
				}

				await addDoc(collection(db, 'reports'), report);
			}
			toast.success('Report submitted. Thanks for helping keep the community safe');

			const newNotif = { ...standardNotifications };
			newNotif.uid = '';
			newNotif.username = '';
			newNotif.timestamp = new Date();
			newNotif.message = '{"blocks":[{"key":"87rfs","text":"New report","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}';
			newNotif.type = 'message';
			delete newNotif.profilePicture;
			delete newNotif.buildId;
			delete newNotif.buildName;
			delete newNotif.comment;
			delete newNotif.commentId;

			await sendNotification('ZyVrojY9BZU5ixp09LftOd240LH3', newNotif);
			setReport(dispatchAuth, null, null);
		} catch (error) {
			errorReport(error.message, true, 'submitReport');
		}
	};

	return { submitReport };
};

/**
 * Hook with functions for sending a user a message
 * @returns
 */
export const useSendMessage = () => {
	const { user, dispatchAuth, messageTab } = useAuthContext();
	/**
	 * Handles sending a message to a user
	 * @param {string} message - the message to send
	 */
	const sendMessage = async message => {
		try {
			// Check if the convo exists
			if (messageTab === null) return;
			let convoData;

			if (messageTab.id) convoData = await getDoc(doc(db, 'conversations', messageTab.id));

			const otherUser = messageTab.users.filter(user => {
				return user !== auth.currentUser.uid;
			})[0];

			// Check if its a new or existing convo
			if (convoData && convoData.exists()) {
				const conversation = convoData.data();
				const newIdMessage = uuidv4().slice(0, 20);
				const messageToSend = {
					message,
					timestamp: serverTimestamp(),
					uid: user.uid,
					parent: messageTab.id,
				};

				// Add the convo to the db
				await setDoc(doc(db, 'conversations', messageTab.id, 'messages', newIdMessage), messageToSend);
				await updateDoc(doc(db, 'conversations', messageTab.id), { lastMessage: serverTimestamp(), lastMessageFrom: user.uid });

				// Check if the current user has this conversation (maybe they removed it from their list)
				const currentUserConvo = await getDoc(doc(db, 'users', user.uid, 'messages', messageTab.id));

				// Check if the current user has this convo on their profile or not. Then update the current users profile with the id to the new convo
				if (currentUserConvo.exists()) {
					await updateDoc(doc(db, 'users', user.uid, 'messages', messageTab.id), { newMessage: false, lastMessage: serverTimestamp() });
				} else {
					await subscribeToConvo(messageTab.id, dispatchAuth);

					await setDoc(doc(db, 'users', user.uid, 'messages', messageTab.id), { id: messageTab.id, newMessage: false, lastMessage: serverTimestamp() });
					setConvoTab(dispatchAuth, convoData);
				}

				// Check if the other user has this conversation or not
				const usersConvo = await getDoc(doc(db, 'users', otherUser, 'messages', messageTab.id));
				if (usersConvo.exists()) {
					await updateDoc(doc(db, 'users', otherUser, 'messages', messageTab.id), { newMessage: true, lastMessage: serverTimestamp() });
				} else {
					await setDoc(doc(db, 'users', otherUser, 'messages', messageTab.id), { id: messageTab.id, newMessage: true, lastMessage: serverTimestamp() });
				}
			} else {
				const newId = uuidv4().slice(0, 20);
				const newIdMessage = uuidv4().slice(0, 20);

				// If the convo doesn't exist
				const conversation = {
					users: messageTab.users,
					lastMessage: serverTimestamp(),
					lastMessageFrom: user.uid,
				};
				const messageToSend = {
					message,
					timestamp: serverTimestamp(),
					uid: user.uid,
					parent: newId,
				};
				// Add the convo to the db
				await setDoc(doc(db, 'conversations', newId), conversation);
				await setDoc(doc(db, 'conversations', newId, 'messages', newIdMessage), messageToSend);

				// Update the current users profile with the id to the new convo
				await setDoc(doc(db, 'users', user.uid, 'messages', newId), { id: newId, newMessage: false, lastMessage: serverTimestamp() });
				await setDoc(doc(db, 'users', otherUser, 'messages', newId), { id: newId, newMessage: true, lastMessage: serverTimestamp() });

				conversation.lastMessage = new Date();
				conversation.id = newId;
				conversation.userProfilePic = messageTab.userProfilePic;
				conversation.username = messageTab.username;
				messageToSend.timestamp = new Date();

				conversation.messaages = [messageToSend];

				setConvoTab(dispatchAuth, conversation);
			}
		} catch (error) {
			toast.error('Something went wrong. Please try again');
			errorReport(error.message, true, 'sendMessage');
		}
	};

	return { sendMessage };
};
/**
 * Hook for fetching a conversation
 * @returns
 */
export const useFetchConversation = () => {
	const { conversations, user, dispatchAuth } = useAuthContext();

	/**
	 * Handles checking if we have a conversation with this user, or if its a new one
	 * @param {obj} userProfile - the user we want to fetch conversation
	 * @returns
	 */
	const fetchConversation = userProfile => {
		try {
			const conversationBox = document.getElementById('conversationBox');

			let foundConvo = null;
			conversations?.map(convo => {
				if (convo.users.includes(userProfile.uid)) foundConvo = convo;
			});

			if (foundConvo) {
				setConvosOpen(dispatchAuth, true);
				setConvoTab(dispatchAuth, foundConvo);
				conversationBox.classList.add('dropdown-open');
			} else {
				// If we didnt find the convo in our current list, check the database for an existing one
				let foundConvo;

				const checkForConvo = async () => {
					try {
						const convosRef = collection(db, 'conversations');
						const convosQ = query(convosRef, where('users', 'array-contains', user.uid));
						const convosSnap = await getDocs(convosQ);

						const convosList = await Promise.all(
							convosSnap.docs.map(async convoDoc => {
								const convo = convoDoc.data();
								if (convo.users.includes(user.uid) && convo.users.includes(userProfile.uid)) {
									convo.id = convoDoc.id;
									convo.lastMessage = createDateFromFirebaseTimestamp(convo.lastMessage.seconds, 'long');

									// Fetch the other users profile
									const userToFetch = convo.users.filter(user => {
										return user !== user.uid;
									})[0];

									const userFetch = await getDoc(doc(db, 'userProfiles', userToFetch));
									const userData = userFetch.data();
									convo.userProfilePic = userData.profilePicture;
									convo.username = userData.username;

									const messagesRef = collection(db, `conversations`, convo.id, 'messages');
									const messagesData = await getDocs(messagesRef);
									let messages = messagesData.docs.map(doc => {
										const message = doc.data();
										message.id = doc.id;

										message.timestamp = new Intl.DateTimeFormat('en-US', { year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(
											message.timestamp ? message.timestamp.seconds * 1000 : new Date()
										);
										return message;
									});

									convo.messages = messages.sort((a, b) => {
										let aDate = new Date(a.timestamp);
										let bDate = new Date(b.timestamp);

										return aDate < bDate ? -1 : 1;
									});

									foundConvo = convo;

									await setDoc(doc(db, 'users', user.uid, 'messages', convo.id), { id: convo.id, newMessage: false, lastMessage: serverTimestamp() });
								}
							})
						);
					} catch (error) {
						errorReport(error.message, true, 'checkForConvo');
					}
				};

				checkForConvo().then(() => {
					if (foundConvo) {
						setConvosOpen(dispatchAuth, true);
						dispatchAuth({
							type: 'NEW_CONVO',
							payload: foundConvo,
						});
						setConvoTab(dispatchAuth, foundConvo);
						conversationBox.classList.add('dropdown-open');
					} else {
						setConvosOpen(dispatchAuth, true);
						setConvoTab(dispatchAuth, {
							users: [user.uid, userProfile.uid],
							lastMessage: null,
							messages: [],
							userProfilePic: userProfile?.profilePicture,
							username: userProfile.username,
							id: null,
						});
						conversationBox.classList.add('dropdown-open');
					}
				});
			}
		} catch (error) {
			errorReport(error.message, true, 'fetchConversation');
		}
	};

	return { fetchConversation };
};

/**
 * Hook with functions to handle following a user
 * @returns
 */
export const useHandleFollowingUser = () => {
	const { dispatchAuth, user, openProfile } = useAuthContext();
	/**
	 * Handles following a users
	 * @param {obj} userProfile - the profile of the user to follow
	 * @returns
	 */
	const handleFollowingUser = async userProfile => {
		try {
			let updatedUser = cloneDeep(userProfile);

			// Check if we are already following this (and if so, unfollow it)
			if (updatedUser.followers.includes(user.uid)) {
				const index = updatedUser.followers.indexOf(user.uid);
				updatedUser.followers.splice(index, 1);

				setUpdateFetchedProfile(dispatchAuth, updatedUser);
				setLocalStoredUser(updatedUser.uid, updatedUser);
				if (openProfile?.uid === updatedUser.uid) setUpdateOpenProfile(dispatchAuth, { followers: updatedUser.followers });
				await updateDoc(doc(db, 'userProfiles', userProfile.uid), { followers: updatedUser.followers, lastModified: serverTimestamp() });
				toast.success(`Successfully unfollowed ${userProfile.username}.`);
			} else {
				updatedUser.followers.push(user.uid);

				setUpdateFetchedProfile(dispatchAuth, updatedUser);
				setLocalStoredUser(updatedUser.uid, updatedUser);
				if (openProfile?.uid === updatedUser.uid) setUpdateOpenProfile(dispatchAuth, { followers: updatedUser.followers });
				await updateDoc(doc(db, 'userProfiles', userProfile.uid), { followers: updatedUser.followers, lastModified: serverTimestamp() });
				toast.success(`Now following ${userProfile.username}!`);
			}
		} catch (error) {
			errorReport(error.message, true, 'handleFollowingUser');
			return;
		}
	};

	return { handleFollowingUser };
};

/**
 * Handles setting the user to follow.
 * @param {*} initialState
 * @param {*} usersProfile - (optional) a users profile to follow. If no profile is passed in, it uses the current openProfile from context
 * @returns [userToFollow, setUserToFollow]
 */
export const useSetUserToFollow = (initialState, usersProfile) => {
	const [userToFollow, setUserToFollow] = useState(initialState);
	const { openProfile } = useAuthContext();

	useEffect(() => {
		if (usersProfile) {
			setUserToFollow(usersProfile);
		} else {
			setUserToFollow(openProfile);
		}
	}, []);

	useEffect(() => {
		if (openProfile && openProfile?.uid === userToFollow?.uid) {
			setUserToFollow(openProfile);
		}
	}, [openProfile]);

	return [userToFollow, setUserToFollow];
};

/**
 * Handles setting the user to message.
 * @param {*} initialState
 * @param {*} usersProfile - (optional) a users profile to message. If no profile is passed in, it uses the current openProfile from context
 * @returns [userToFollow, setUserToFollow]
 */
export const useSetUserToMessage = (initialState, usersProfile) => {
	const [userToMessage, setUserToMessage] = useState(initialState);
	const { openProfile } = useAuthContext();

	useEffect(() => {
		if (usersProfile) {
			setUserToMessage(usersProfile);
		} else {
			setUserToMessage(openProfile);
		}
	}, []);

	return [userToMessage, setUserToMessage];
};

/**
 * Hook with functions to handle favoriting a build
 * @returns
 */
export const useHandleFavoriting = () => {
	const { user, dispatchAuth } = useAuthContext();
	const { updateUserDb } = useUpdateProfile();

	/**
	 * Handles a user favoriting a build
	 * @param {string} buildId - id of the build to favorite
	 */
	const handleFavoriting = async buildId => {
		try {
			let newFavorites = cloneDeep(user.favorites);

			// Check if we already upvoted this (and if so, unupvote it)
			if (newFavorites.includes(buildId)) {
				const index = newFavorites.indexOf(buildId);
				newFavorites.splice(index, 1);

				setUserfavorites(dispatchAuth, newFavorites);
				updateUserDb({ favorites: newFavorites });
			} else {
				newFavorites.push(buildId);
				setUserfavorites(dispatchAuth, newFavorites);
				updateUserDb({ favorites: newFavorites });
			}
		} catch (error) {
			errorReport(error.message, true, 'handleFavoriting');
		}
	};

	return { handleFavoriting };
};

/**
 * Hook with functions to handle blocking a user
 * @returns
 */
export const useBlockUser = () => {
	const { user, dispatchAuth, userToBlock } = useAuthContext();
	const { updateUserProfilesAndDb } = useUpdateProfile();

	/**
	 * Handles blocking a user.
	 *
	 */
	const blockUser = async () => {
		try {
			let newBlockList;

			// Check if the user has anyone blocked yet
			if (user.blockList) {
				newBlockList = [...user.blockList];

				if (user.blockList.includes(userToBlock)) {
					const index = newBlockList.indexOf(userToBlock);
					newBlockList.splice(index, 1);

					updateUserProfilesAndDb({ blockList: newBlockList, lastModified: serverTimestamp() });
					toast.success('User unblocked.');
				} else {
					newBlockList.push(userToBlock);
					updateUserProfilesAndDb({ blockList: newBlockList, lastModified: serverTimestamp() });
					toast.success('User blocked.');
				}
			} else {
				newBlockList = [userToBlock];
				updateUserProfilesAndDb({ blockList: newBlockList, lastModified: serverTimestamp() });
				toast.success('User blocked.');
			}

			updateUserState(dispatchAuth, { blockList: newBlockList });

			setUserToBlock(dispatchAuth, null);
		} catch (error) {
			errorReport(error.message, true, 'blockUser');
		}
	};

	return { blockUser };
};

/**
 * Returns the current users conversations, sorted by date (newest)
 * @param {*} initialState
 * @returns [convos, setConvos]
 */
export const useSetConversations = initialState => {
	const { conversations } = useAuthContext();
	const [convos, setConvos] = useState(initialState);

	useEffect(() => {
		let sorted = conversations.sort((a, b) => {
			let aDate = a.lastMessage;
			let bDate = b.lastMessage;

			return aDate < bDate ? 1 : -1;
		});
		setConvos(sorted);
	}, [conversations]);

	return [convos, setConvos];
};

/**
 * Returns the current new messages that a user has
 * @param {*} initialState
 * @returns
 */
export const useGetNewMessages = initialState => {
	const { conversations, user } = useAuthContext();
	const [newMessages, setNewMessages] = useState(initialState);
	/**
	 * Handles checking for anew message
	 * @returns
	 */
	const checkForNewMessages = () => {
		let newMessages = 0;
		if (conversations?.length > 0) {
			for (let i = 0; i < conversations.length; i++) {
				if (conversations[i]?.newMessage && conversations[i]?.lastMessageFrom !== user.uid && conversations[i]?.lastMessageFrom !== undefined) {
					newMessages++;
				}
			}
		}
		return newMessages > 99 ? '99+' : newMessages;
	};

	useEffect(() => {
		setNewMessages(checkForNewMessages());
	}, [conversations]);

	return [newMessages, setNewMessages];
};

/**
 * Returns the current new notifications that a user has
 * @param {*} initialState
 * @returns [totalUnreadNotifs, setTotalUnreadNotifs]
 */
export const useGetNewNotifs = initialState => {
	const { authLoading, user, isAuthenticated } = useAuthContext();
	const [totalUnreadNotifs, setTotalUnreadNotifs] = useState(initialState);
	/**
	 * Calculates total unread notifications
	 */
	const calcUnreadNotifs = () => {
		setTotalUnreadNotifs(0);
		user.notifications.map(notif => {
			if (!notif.read) {
				setTotalUnreadNotifs(prevstate => (prevstate += 1));
			}
		});
	};

	useEffect(() => {
		if (!authLoading && isAuthenticated) {
			if (user.notifications) {
				calcUnreadNotifs();
			}
		}
	}, [authLoading, isAuthenticated, user]);
	return [totalUnreadNotifs, setTotalUnreadNotifs];
};

/**
 * Returns a users profile. First check if we already have them loaded in context, then local storage, then new fetch from server.
 * Returns a profile and a loading state
 * @param {*} initialState
 * @param {*} uid
 * @returns [usersProfile, loadingProfile]
 */
export const useReturnUserProfile = (initialState, uid) => {
	const { fetchedUserProfiles } = useAuthContext();
	const [usersProfile, setUsersProfile] = useState(initialState);
	const [loadingProfile, setLoadingProfile] = useState(true);
	const { fetchUsersProfile, checkIfUserInContext } = useFetchUser();

	useEffect(() => {
		if (uid) {
			let foundProfile = checkIfUserInContext(uid);
			if (foundProfile) {
				setUsersProfile(foundProfile);
				setLoadingProfile(false);
			} else {
				fetchUsersProfile(uid, setLoadingProfile).then(fetchedUser => {
					setUsersProfile(fetchedUser);
					setLoadingProfile(false);
				});
			}
		}
	}, [uid]);

	useEffect(() => {
		if (usersProfile) {
			let foundProfile = checkIfUserInContext(uid);
			if (foundProfile) {
				setUsersProfile(foundProfile);
				setLoadingProfile(false);
			} else {
				fetchUsersProfile(uid, setLoadingProfile).then(fetchedUser => {
					setUsersProfile(fetchedUser);
					setLoadingProfile(false);
				});
			}
		}
	}, [usersProfile, fetchedUserProfiles]);

	return [usersProfile, loadingProfile];
};

/**
 * Handles getting a users profile. Sets it in the context as openProfile
 * @param {*} usersId
 */
export const useGetAndSetOpenUserProfile = usersId => {
	const { dispatchAuth } = useAuthContext();
	const { fetchUsersProfile, checkIfUserInContext } = useFetchUser();

	useEffect(() => {
		setOpenProfile(dispatchAuth, null);
		setFetchingProfile(dispatchAuth, true);

		let foundProfile = checkIfUserInContext(usersId);
		if (foundProfile) {
			setOpenProfile(dispatchAuth, foundProfile);
			setFetchingProfile(dispatchAuth, false);
		} else {
			fetchUsersProfile(usersId).then(fetchedUser => {
				setOpenProfile(dispatchAuth, fetchedUser);
			});
		}
	}, []);
};

/**
 * Handles returning the current usernames custom color
 * @returns [usernameColor, setUsernameColor]
 */
export const useReturnUsernameCustomColor = initialState => {
	const { user, authLoading, isAuthenticated } = useAuthContext();
	const [usernameColor, setUsernameColor] = useState(initialState);

	useEffect(() => {
		if (!authLoading && isAuthenticated) {
			if (user.customUsernameColor) {
				setUsernameColor(user.customUsernameColor);
			}
		}
	}, [authLoading, isAuthenticated, user]);

	return [usernameColor, setUsernameColor];
};

export const useCheckMinSubscriptionTier = () => {
	const { user, isAuthenticated } = useAuthContext();

	/**
	 * Checks if the current subscription tier of a user meets the minimum tier required
	 * @param {int} minTier - the minimum tier the user needs to be
	 */
	const checkMinSubscriptionTier = minTier => {
		if (isAuthenticated) {
			if (minTier === 1) {
				if (user.subscribed === 'tier1' || user.subscribed === 'tier2' || user.subscribed === 'tier3') {
					return true;
				} else {
					return false;
				}
			} else if (minTier === 2) {
				if (user.subscribed === 'tier2' || user.subscribed === 'tier3') {
					return true;
				} else {
					return false;
				}
			} else if (minTier === 3) {
				if (user.subscribed === 'tier3') {
					return true;
				} else {
					return false;
				}
			}
		}
	};

	return { checkMinSubscriptionTier };
};

// State Updaters ---------------------------------------------------------------------------------------------------//
/**
 * Handles setting the newSub state in context
 * @param {function} dispatchAuth - the dispatch function
 * @param {bool} bool - True or false
 */
export const setNewSub = (dispatchAuth, bool) => {
	dispatchAuth({
		type: 'SET_AUTH',
		payload: {
			newSub: false,
		},
	});
};

/**
 * Handles setting the id of the user we want to block in context.
 * @param {function} dispatchAuth - the dispatch function
 * @param {string} id - Id of the user to block
 */
export const setUserToBlock = (dispatchAuth, id) => {
	dispatchAuth({
		type: 'SET_USER_TO_BLOCK',
		payload: id,
	});
};

/**
 * Handles setting the current covnersation message in context
 * @param {function} dispatchAuth - the dispatch function
 * @param {object} convo - the current conversation
 */
export const setConvoTab = (dispatchAuth, convo) => {
	dispatchAuth({
		type: 'SET_MESSAGE_TAB',
		payload: {
			messageTab: convo,
		},
	});
};

/**
 * Handles setting a report in context
 * @param {function} dispatchAuth - the dispatch function
 * @param {string} type - the type of the report (comment, build, user)
 * @param {obj} content - the content of the report
 */
export const setReport = (dispatchAuth, type, content) => {
	dispatchAuth({
		type: 'SET_REPORT',
		payload: {
			reportingContent: content,
			reportType: type,
		},
	});
};

/**
 * Sets the id of the account to delete in context
 * @param {function} dispatchAuth - the dispatch function
 * @param {id} id - id of the account to delete
 */
export const setAccountToDelete = (dispatchAuth, id) => {
	dispatchAuth({
		type: 'SET_ACCOUNT_TO_DELETE',
		payload: id,
	});
};

/**
 * Handles when a user signs up with google and neeeds to enter a username. Sets context
 * @param {function} dispatchAuth - the dispatch function
 * @param {string} username
 */
export const setNewSignup = (dispatchAuth, username) => {
	dispatchAuth({
		type: 'SET_NEW_SIGNUP',
		payload: username,
	});
};

/**
 * Handles setting the id for the convo to delete in the context
 * @param {function} dispatchAuth - the dispatch function
 * @param {string} id - id of the convo to delete
 */
export const setDeleteConversationId = (dispatchAuth, id) => {
	dispatchAuth({
		type: 'SET_DELETE_CONVO_ID',
		payload: id,
	});
};

/**
 * Handles setting the state for notifications in the context
 * @param {function} dispatchAuth - the dispatch function
 * @param {arr} notifications - an array of notifications to set in the context
 */
export const setNotifications = (dispatchAuth, notifications) => {
	dispatchAuth({
		type: 'UPDATE_USER',
		payload: { notifications },
	});
};

/**
 * Handles setting the reset password option in context. If set to true, Shows the reset password modal
 * @param {function} dispatchAuth - the dispatch function
 * @param {bool} bool - true or false
 */
export const setResetPassword = (dispatchAuth, bool) => {
	dispatchAuth({
		type: 'SET_RESET_PASSWORD',
		payload: bool,
	});
};

/**
 * Updates the context if we are fetching a users profile
 * @param {function} dispatchAuth - the dispatch function
 * @param {bool} bool - true or false
 */
export const setFetchingProfile = (dispatchAuth, bool) => {
	dispatchAuth({
		type: 'SET_FETCHING_PROFILE',
		payload: bool,
	});
};

/**
 * Handles setting if the user is editing their bio in context
 * @param {function} dispatchAuth - the dispatch function
 * @param {*} value - the value for editing the bio. False to stop editing, or an object if editing.
 */
export const setEditingBio = (dispatchAuth, value) => {
	dispatchAuth({
		type: 'SET_EDITING_BIO',
		payload: value,
	});
};

/**
 * Handles setting if the user is editing their email in context
 * @param {function} dispatchAuth - the dispatch function
 * @param {*} value - the value for editing the profile. False to stop editing, or an string if editing.
 */
export const setEditingEmail = (dispatchAuth, value) => {
	dispatchAuth({
		type: 'SET_EDITING_EMAIL',
		payload: value,
	});
};

/**
 * Handles setting if the verified email when a user is changing their email
 * @param {function} dispatchAuth - the dispatch function
 * @param {*} value - the value for editing the profile. False to stop editing, or an string if editing.
 */
export const setVerifyEditedEmail = (dispatchAuth, value) => {
	dispatchAuth({
		type: 'SET_VERIFY_EDITED_EMAIL',
		payload: value,
	});
};

/**
 * Handles setting the users favorites in the context
 * @param {function} dispatchAuth - the dispatch function
 * @param {arr} favorites - an array of the users favorite builds
 */
export const setUserfavorites = (dispatchAuth, favorites) => {
	dispatchAuth({
		type: 'UPDATE_USER',
		payload: { favorites: favorites },
	});
};

/**
 * Handles updating the users state in context
 * @param {function} dispatchAuth - the dispatch function
 * @param {obj} update - The updates for the user
 */
export const updateUserState = (dispatchAuth, update) => {
	dispatchAuth({
		type: 'UPDATE_USER',
		payload: update,
	});
};

/**
 * handles setting if the convos are open in the messaging tab, context
 * @param {function} dispatchAuth - the dispatch function
 * @param {bool} bool - true or false
 */
export const setConvosOpen = (dispatchAuth, bool) => {
	dispatchAuth({
		type: 'SET_AUTH',
		payload: { convosOpen: bool },
	});
};

/**
 * handles placing the fetched profile in the context
 * @param {function} dispatchAuth - the dispatch function
 * @param {obj} profile - the fetched users profile
 * @param {arr} fetchedUserProfiles - the fetched users profiles to add the new profile to
 */
export const setFetchedUserProfiles = (dispatchAuth, profile, fetchedUserProfiles) => {
	if (profile) {
		let foundUser;
		fetchedUserProfiles.map((user, i) => {
			if (user.uid === profile.uid) {
				foundUser = i;
			}
		});

		if (foundUser) {
			fetchedUserProfiles.splice(foundUser, 1);
		} else {
			fetchedUserProfiles.push(profile);
		}

		dispatchAuth({
			type: 'SET_AUTH',
			payload: { fetchedUserProfiles: fetchedUserProfiles },
		});
	}
};

/**
 * handles setting the current open profile
 * @param {function} dispatchAuth - the dispatch function
 * @param {obj} profile - The current open profile
 */
export const setOpenProfile = (dispatchAuth, profile) => {
	dispatchAuth({
		type: 'SET_AUTH',
		payload: { openProfile: profile },
	});
};

/**
 * Updates the currently open profile
 * @param {function} dispatchAuth - the dispatch function
 * @param {obj} update - the fields to update
 */
export const setUpdateOpenProfile = (dispatchAuth, update) => {
	dispatchAuth({
		type: 'UPDATE_OPEN_PROFILE',
		payload: update,
	});
};

/**
 * Updates a fetched user in the context with a new version
 * @param {function} dispatchAuth - the dispatch function
 * @param {obj} updatedUser - the entire updated user to replace the old one
 */
export const setUpdateFetchedProfile = (dispatchAuth, updatedUser) => {
	dispatchAuth({
		type: 'UPDATE_FETCHED_USERS_PROFILE',
		payload: updatedUser,
	});
};

/**
 * handles setting if a user is authenticated
 * @param {function} dispatchAuth - the dispatch function
 * @param {bool} authenticated - true or false if the user is authenticated
 */
export const setAuthenticated = (dispatchAuth, authenticated) => {
	dispatchAuth({
		type: 'SET_AUTH',
		payload: {
			isAuthenticated: authenticated,
		},
	});
};

/**
 * handles setting if the subscribe modal is open or closed
 * @param {function} dispatchAuth - the dispatch function
 * @param {bool} value - true or false if the user is authenticated
 */
export const setSubscribeModal = (dispatchAuth, value) => {
	dispatchAuth({
		type: 'SET_AUTH',
		payload: {
			subscribeModal: value,
		},
	});
};
