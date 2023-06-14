import { useContext, useEffect } from 'react';
import { db } from '../../firebase.config';
import { updateDoc, doc, getDoc, collection, deleteDoc, query, getDocs, serverTimestamp, setDoc, addDoc, limit, orderBy, startAfter, where, getDocFromCache, getDocsFromCache, increment } from 'firebase/firestore';
import { signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';
import { googleProvider } from '../../firebase.config';
import { auth } from '../../firebase.config';
import { cloneDeep } from 'lodash';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { sendNotification } from './AuthUtils';
//---------------------------------------------------------------------------------------------------//
import AuthContext from './AuthContext';
import BuildContext from '../build/BuildContext';
import { updateWeeklyUpvoted } from './AuthUtils';
//---------------------------------------------------------------------------------------------------//
import standardUser from '../../utilities/standardUser';
import standardNotifications from '../../utilities/standardNotifications';
import standardUserProfile from '../../utilities/standardUserProfile';
import draftJsToPlainText from '../../utilities/draftJsToPlainText';
import subscribeToConvo from '../../utilities/subscribeToConvo';

const useAuth = () => {
	const { dispatchAuth } = useContext(AuthContext);

	/**
	 * Handles creating a new users account on the DB. Sets up a 'users' doc, a 'usersProfile' doc, and their 'notifications' doc.
	 * We havent set up username yet as that comes after initial setup.
	 * @param {*} name
	 * @param {*} email
	 * @param {*} uid
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
			console.log(error);
		}
	};

	/**
	 * handles logging in with Google
	 */
	const loginWithGoogle = async () => {
		try {
			const userCredential = await signInWithPopup(auth, googleProvider).catch(err => {
				console.log(err);
				toast.error('Something went wrong. Please try again');
				return;
			});

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
			console.log(error);
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

			const email = userCredential.user.email;
			const uid = userCredential.user.uid;
			const name = '';
			const createdAt = serverTimestamp();

			setNewSignup(dispatchAuth, true);
			createNewUserAccount(name, email, uid, createdAt);
		} catch (error) {
			console.log(error);
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
	const { dispatchAuth } = useContext(AuthContext);
	/**
	 * Handles fetching a profile from the userProfiles DB.
	 * @param {string} id - the id of the user to fetch
	 */
	const fetchUsersProfile = async id => {
		try {
			setFetchingProfile(dispatchAuth, true);

			const fetchedProfile = await getDoc(doc(db, 'userProfiles', id));

			if (fetchedProfile.exists()) {
				const profile = fetchedProfile.data();
				profile.uid = fetchedProfile.id;
				dispatchAuth({
					type: 'FETCH_USERS_PROFILE',
					payload: profile,
				});

				setFetchingProfile(dispatchAuth, false);
			} else {
				// Check if we can find it by username
				const userCol = collection(db, 'userProfiles');
				const q = query(userCol, where('username', '==', id));
				const fetchedProfiles = await getDocs(q);
				let profiles = [];

				fetchedProfiles.forEach(profile => {
					let userProfile = profile.data();
					userProfile.uid = profile.id;
					profiles.push(userProfile);
				});

				if (profiles.length > 0) {
					const profile = profiles[0];

					dispatchAuth({
						type: 'FETCH_USERS_PROFILE',
						payload: profile,
					});

					setFetchingProfile(dispatchAuth, false);
				} else {
					setFetchingProfile(dispatchAuth, false);
					throw new Error(`Couldn't find profile!`);
				}
			}
		} catch (error) {
			console.log(error);
		}
	};

	/**
	 * handles fetching the profile from the server if for some reason fetching from the cache fails
	 * @param {string} id - id of the user to fetch
	 */
	const fetchUsersProfileServer = async id => {
		try {
			const fetchedProfile = await getDoc(doc(db, 'userProfiles', id));

			if (fetchedProfile.exists()) {
				const profile = fetchedProfile.data();
				profile.uid = fetchedProfile.id;
				dispatchAuth({
					type: 'FETCH_USERS_PROFILE',
					payload: profile,
				});

				setFetchingProfile(dispatchAuth, false);
			} else {
				// Check if we can find it by username
				const userCol = collection(db, 'userProfiles');
				const q = query(userCol, where('username', '==', id));
				const fetchedProfiles = await getDocs(q);
				let profiles = [];

				fetchedProfiles.forEach(profile => {
					let userProfile = profile.data();
					userProfile.uid = profile.id;
					profiles.push(userProfile);
				});

				if (profiles.length > 0) {
					const profile = profiles[0];

					dispatchAuth({
						type: 'FETCH_USERS_PROFILE',
						payload: profile,
					});

					setFetchingProfile(dispatchAuth, false);
				} else {
					setFetchingProfile(dispatchAuth, false);
					throw new Error(`Couldn't find profile!`);
				}
			}
		} catch (error) {
			console.log(error);
		}
	};

	/**
	 * Fetches the lasted added/updated users.  Updates the latest fetched local storage and updates the cache
	 */
	const fetchLastUpdatedUsers = async () => {
		try {
			const usersRef = collection(db, 'userProfiles');
			// Get the most recently updated doc
			let newestDocQ = query(usersRef, orderBy('lastModified', 'desc'), limit(1));
			const newestDocSnap = await getDocs(newestDocQ);
			let newestDoc;

			newestDocSnap.forEach(doc => {
				newestDoc = doc.data();
			});

			// Fetch the locally saved newest
			const localNewest = JSON.parse(localStorage.getItem('newestUser'));

			if (localNewest) {
				// check if the local newest update is now older than the last thing updated on the server
				if (localNewest.seconds < newestDoc.lastModified.seconds) {
					let newDocsQ = query(usersRef, where('lastModified', '>', new Date(localNewest.seconds * 1000)));
					await getDocs(newDocsQ); // simply getDocs so it updates our cache

					localStorage.setItem('newestUser', JSON.stringify(newestDoc.lastModified));
				}
			} else {
				// Users first time/ no localNewest saved, fetch all builds so they're cached
				console.log(`No local stored timestamp`);
				const userProfilesRef = collection(db, 'userProfiles');
				await getDocs(userProfilesRef);
				localStorage.setItem('newestUser', JSON.stringify(newestDoc.lastModified));
			}
		} catch (error) {
			console.log(error);
		}
	};

	return { fetchUsersProfile };
};
/**
 * Hook with functions to handle voting on builds
 * @returns
 */
export const useHandleVoting = () => {
	const { user } = useContext(AuthContext);
	const { updateUserDb, updateUserProfilesAndDb } = useUpdateProfile();

	/**
	 * Handles updating the users voting on the server. Updates the builds vote count and the current users voted
	 * @param {string} type - the type of vote. 'upVote' or 'downVote'
	 * @param {obj} build - the build to vote on
	 */
	const handleVoting = async (type, build) => {
		try {
			if (!user?.username) return;
			let newUpVotes = cloneDeep(user.upVotes);
			let newDownVotes = cloneDeep(user.downVotes);

			if (type === 'upVote') {
				// Check if we already upvoted this (and if so, unupvote it)
				if (newUpVotes.includes(build.id)) {
					const index = newUpVotes.indexOf(build.id);
					newUpVotes.splice(index, 1);

					await updateUserDb({ upVotes: newUpVotes });
					await updateDoc(doc(db, process.env.REACT_APP_BUILDSDB, build.id), { upVotes: (build.upVotes -= 1), lastModified: serverTimestamp() });
					await updateUserProfilesAndDb({ rocketReputation: increment(-1) }, build.uid);
					await updateWeeklyUpvoted(build.id, 'remove', user.uid);
				} else {
					newUpVotes.push(build.id);

					await updateUserDb({ upVotes: newUpVotes });
					await updateDoc(doc(db, process.env.REACT_APP_BUILDSDB, build.id), { upVotes: (build.upVotes += 1), lastModified: serverTimestamp() });
					await updateUserProfilesAndDb({ rocketReputation: increment(1) }, build.uid);

					if (build.uid !== user.uid) {
						await updateWeeklyUpvoted(build.id, 'add', user.uid);
					}

					// If the user has this downvoted but wants to upvote it, remove the downvote
					if (newDownVotes.includes(build.id)) {
						const index = newDownVotes.indexOf(build.id);
						newDownVotes.splice(index, 1);

						await updateUserDb({ downVotes: newDownVotes });
						await updateDoc(doc(db, process.env.REACT_APP_BUILDSDB, build.id), { downVotes: (build.downVotes -= 1), lastModified: serverTimestamp() });
						await updateUserProfilesAndDb({ rocketReputation: increment(1) }, build.uid);
					}
				}
			}
			if (type === 'downVote') {
				// Check if we already downvoted this (and if so, undownvote it)
				if (newDownVotes.includes(build.id)) {
					const index = newDownVotes.indexOf(build.id);
					newDownVotes.splice(index, 1);

					await updateUserDb({ downVotes: newDownVotes });
					await updateDoc(doc(db, process.env.REACT_APP_BUILDSDB, build.id), { downVotes: (build.downVotes -= 1), lastModified: serverTimestamp() });
					await updateUserProfilesAndDb({ rocketReputation: increment(1) }, build.uid);
				} else {
					newDownVotes.push(build.id);

					await updateUserDb({ downVotes: newDownVotes });
					await updateDoc(doc(db, process.env.REACT_APP_BUILDSDB, build.id), { downVotes: (build.downVotes += 1), lastModified: serverTimestamp() });
					await updateUserProfilesAndDb({ rocketReputation: increment(-1) }, build.uid);
					await updateWeeklyUpvoted(build.id, 'remove', user.uid);

					// If the user has this upvoted but wants to downvote it, remove the upvote
					if (newUpVotes.includes(build.id)) {
						const index = newUpVotes.indexOf(build.id);
						newUpVotes.splice(index, 1);

						await updateUserDb({ upVotes: newUpVotes });
						await updateDoc(doc(db, process.env.REACT_APP_BUILDSDB, build.id), { upVotes: (build.upVotes -= 1), lastModified: serverTimestamp() });
						await updateUserProfilesAndDb({ rocketReputation: increment(-1) }, build.uid);
						await updateUserProfilesAndDb({ rocketReputation: increment(-1) }, build.uid);
					}
				}
			}
		} catch (error) {
			console.log(error);
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
	const { user, dispatchAuth } = useContext(AuthContext);
	/**
	 * Handles updating the users profile picture on the server and context
	 * @param {*} profilePicture
	 */
	const updateUserProfilePic = async profilePicture => {
		try {
			updateUserProfilesAndDb({ profilePicture, lastModified: serverTimestamp() });

			toast.success('Profile Picture updated!');
			dispatchAuth({
				type: 'UPDATE_USER',
				payload: { profilePicture },
			});
		} catch (error) {
			console.log(error);
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

			toast.success('Bio updated!');
			dispatchAuth({
				type: 'UPDATE_USER',
				payload: { bio },
			});
		} catch (error) {
			console.log(error);
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
			await updateDoc(doc(db, 'users', userUid ? userUid : user.uid), update);
			dispatchAuth({
				type: 'UPDATE_USER',
				payload: { ...update },
			});
		} catch (error) {
			console.log(error);
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
			console.log(error);
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
			console.log(error);
		}
	};

	return { updateUserProfilePic, updateUserBio, updateUserDb, updateUserProfilesAndDb };
};

/**
 * Hook with functions for notifications
 */
export const useHandleNotifications = () => {
	const { user, dispatchAuth, lastFetchedNotification } = useContext(AuthContext);
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
			console.log(error);
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

			await deleteDoc(doc(db, 'users', user.uid, 'notifications', id)).catch(err => console.log(err));
			setNotifications(dispatchAuth, newNotifs);
		} catch (error) {
			console.log(error);
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
			console.log(error);
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
						await updateDoc(doc(db, 'users', user.uid, 'notifications', notif.id), notif).catch(err => console.log(err));
					};

					updateNotif();
				} else {
					newNotifs.push(notif);
				}
			});

			setNotifications(dispatchAuth, newNotifs);
		} catch (error) {
			console.log(error);
		}
	};

	return { handleDeleteAllNotifications, handleDeleteNotification, fetchMoreNotifications, setNotificationsRead };
};

/**
 * Hook with functions for deleting a conversation
 * @returns
 */
export const useDeleteConversation = () => {
	const { user, dispatchAuth, conversations } = useContext(AuthContext);
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
			console.log(error);
		}
	};

	return { deleteConversation };
};
/**
 * Hook with functions to handle submitting a report
 * @returns
 */
export const useSubmitReport = () => {
	const { user, reportType, reportingContent } = useContext(AuthContext);
	const { loadedBuild } = useContext(BuildContext);

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

				if (user?.username) {
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

				if (user?.username) {
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

				if (user?.username) {
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
		} catch (error) {
			console.log(error);
		}
	};

	return { submitReport };
};

/**
 * Hook with functions for sending a user a message
 * @returns
 */
export const useSendMessage = () => {
	const { user, dispatchAuth, messageTab } = useContext(AuthContext);
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
			console.log(error);
		}
	};

	return { sendMessage };
};
/**
 * Hook for fetching a conversation
 * @returns
 */
export const useFetchConversation = () => {
	const { conversations, user, dispatchAuth } = useContext(AuthContext);

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
									convo.lastMessage = new Intl.DateTimeFormat('en-US', { year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(convo.lastMessage.seconds * 1000);

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
						console.log(error);
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
			console.log(error);
		}
	};

	return { fetchConversation };
};

/**
 * Hook with functions to handle following a user
 * @returns
 */
export const useHandleFollowingUser = () => {
	const { dispatchAuth, fetchedUserProfile, user } = useContext(AuthContext);
	/**
	 * Handles following a users
	 * @param {*} uid
	 * @returns
	 */
	const handleFollowingUser = async () => {
		try {
			let newFollowers = fetchedUserProfile.followers ? cloneDeep(fetchedUserProfile.followers) : [];

			// Check if we are already following this (and if so, unupvote it)
			if (newFollowers.includes(user.uid)) {
				const index = newFollowers.indexOf(user.uid);
				newFollowers.splice(index, 1);

				dispatchAuth({ type: 'UPDATE_FETCHED_USERS_PROFILE', payload: { followers: newFollowers } });

				await updateDoc(doc(db, 'userProfiles', fetchedUserProfile.uid), { followers: newFollowers, lastModified: serverTimestamp() });
			} else {
				newFollowers.push(user.uid);
				dispatchAuth({ type: 'UPDATE_FETCHED_USERS_PROFILE', payload: { followers: newFollowers } });

				await updateDoc(doc(db, 'userProfiles', fetchedUserProfile.uid), { followers: newFollowers, lastModified: serverTimestamp() });
			}
		} catch (error) {
			console.log(error);
			return;
		}
	};

	return { handleFollowingUser };
};

/**
 * Hook with functions to handle favoriting a build
 * @returns
 */
export const useHandleFavoriting = () => {
	const { user, dispatchAuth } = useContext(AuthContext);
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
			console.log(error);
		}
	};

	return { handleFavoriting };
};

/**
 * Hook with functions to handle blocking a user
 * @returns
 */
export const useBlockUser = () => {
	const { user, dispatchAuth, userToBlock } = useContext(AuthContext);
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

			dispatchAuth({
				type: 'UPDATE_USER',
				payload: { blockList: newBlockList },
			});

			setUserToBlock(dispatchAuth, null);
		} catch (error) {
			console.log(error);
		}
	};

	return { blockUser };
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
 * Handles setting if the user is editing their profile in context
 * @param {function} dispatchAuth - the dispatch function
 * @param {*} value - the value for editing the profile. False to stop editing, or an object if editing.
 */
export const setEditingProfile = (dispatchAuth, value) => {
	dispatchAuth({
		type: 'SET_EDITING_PROFILE',
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
