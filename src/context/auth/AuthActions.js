import { useContext, useEffect } from 'react';
import { db } from '../../firebase.config';
import { updateDoc, doc, getDoc, collection, deleteDoc, query, getDocs, serverTimestamp, setDoc, addDoc, limit, orderBy, startAfter, where, getDocFromCache, getDocsFromCache, increment } from 'firebase/firestore';
import { signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';
import { googleProvider } from '../../firebase.config';
import { auth } from '../../firebase.config';
import { deleteUser, getAuth } from 'firebase/auth';
import { cloneDeep, update } from 'lodash';
import { toast } from 'react-toastify';
import { compressAccurately } from 'image-conversion';
import { v4 as uuidv4 } from 'uuid';
//---------------------------------------------------------------------------------------------------//
import AuthContext from './AuthContext';
import BuildContext from '../build/BuildContext';
//---------------------------------------------------------------------------------------------------//
import standardUser from '../../utilities/standardUser';
import standardNotifications from '../../utilities/standardNotifications';
import standardUserProfile from '../../utilities/standardUserProfile';
import { uploadImage } from '../../utilities/uploadImage';
import draftJsToPlainText from '../../utilities/draftJsToPlainText';
import subscribeToConvo from '../../utilities/subscribeToConvo';

const useAuth = () => {
	const { dispatchAuth, user, accountToDelete, newUsername, messageTab, reportingContent, reportType, fetchedUserProfile, lastFetchedNotification, newConvo, conversations, userToBlock } = useContext(AuthContext);
	const { loadedBuild } = useContext(BuildContext);

	/**
	 * Handles when a user signs up with google and neeeds to enter a username
	 * @param {*} value
	 */
	const setNewSignup = value => {
		dispatchAuth({ type: 'SET_NEW_SIGNUP', payload: value });
	};

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

			updateUserState({
				notifications: [notification],
			});
		} catch (error) {
			console.log(error);
		}
	};

	/**
	 * Handles updating the users state
	 * @param {*} update
	 */
	const updateUserState = update => {
		dispatchAuth({ type: 'UPDATE_USER', payload: update });
	};

	/**
	 * Handles updating the user on the DB
	 * @param {*} update
	 */
	const updateUserDb = async update => {
		try {
			await updateDoc(doc(db, 'users', user.uid), update);
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
	 * @param {*} update
	 */
	const updateUserProfiles = async update => {
		try {
			await updateDoc(doc(db, 'userProfiles', user.uid), update);
		} catch (error) {
			console.log(error);
		}
	};

	/**
	 * Handles updating the users profile picture on the server
	 * @param {*} picture
	 */
	const updateUserProfilePicture = async profilePicture => {
		try {
			await updateDoc(doc(db, 'users', user.uid), { profilePicture, lastModified: serverTimestamp() });
			await updateDoc(doc(db, 'userProfiles', user.uid), { profilePicture, lastModified: serverTimestamp() });

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
	 * Handles updating the users bio on the server
	 * @param {*} bio
	 */
	const updateUserDbBio = async bio => {
		try {
			await updateDoc(doc(db, 'users', user.uid), { bio, lastModified: serverTimestamp() });
			await updateDoc(doc(db, 'userProfiles', user.uid), { bio, lastModified: serverTimestamp() });

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
	 * Handles updating the users profile picture on the server
	 * @param {*} profilePicture
	 */
	const updateUserDbProfilePic = async profilePicture => {
		try {
			await updateDoc(doc(db, 'users', user.uid), { profilePicture, lastModified: serverTimestamp() });
			await updateDoc(doc(db, 'userProfiles', user.uid), { profilePicture, lastModified: serverTimestamp() });

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
	 * Handles updating the users voting on the server. Updates the builds vote count and the current users voted
	 * @param {*} type
	 * @param {*} build
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

					dispatchAuth({ type: 'UPDATE_USER', payload: { upVotes: newUpVotes } });

					updateUserDb({ upVotes: newUpVotes });
					await updateDoc(doc(db, process.env.REACT_APP_BUILDSDB, build.id), { upVotes: (build.upVotes -= 1), lastModified: serverTimestamp() });
					await updateDoc(doc(db, 'users', build.uid), { rocketReputation: increment(-1) });
					await updateDoc(doc(db, 'userProfiles', build.uid), { rocketReputation: increment(-1) });

					await updateWeeklyUpvoted(build.id, 'remove');
				} else {
					newUpVotes.push(build.id);
					dispatchAuth({ type: 'UPDATE_USER', payload: { upVotes: newUpVotes } });

					updateUserDb({ upVotes: newUpVotes });
					await updateDoc(doc(db, process.env.REACT_APP_BUILDSDB, build.id), { upVotes: (build.upVotes += 1), lastModified: serverTimestamp() });
					await updateDoc(doc(db, 'users', build.uid), { rocketReputation: increment(1) });
					await updateDoc(doc(db, 'userProfiles', build.uid), { rocketReputation: increment(1) });

					if (build.uid !== user.uid) {
						await updateWeeklyUpvoted(build.id, 'add');
					}

					// If the user has this downvoted but wants to upvote it, remove the downvote
					if (newDownVotes.includes(build.id)) {
						const index = newDownVotes.indexOf(build.id);
						newDownVotes.splice(index, 1);

						dispatchAuth({ type: 'UPDATE_USER', payload: { downVotes: newDownVotes } });

						updateUserDb({ downVotes: newDownVotes });
						await updateDoc(doc(db, process.env.REACT_APP_BUILDSDB, build.id), { downVotes: (build.downVotes -= 1), lastModified: serverTimestamp() });
						await updateDoc(doc(db, 'users', build.uid), { rocketReputation: increment(1) });
						await updateDoc(doc(db, 'userProfiles', build.uid), { rocketReputation: increment(1) });
					}
				}
			}
			if (type === 'downVote') {
				// Check if we already downvoted this (and if so, undownvote it)
				if (newDownVotes.includes(build.id)) {
					const index = newDownVotes.indexOf(build.id);
					newDownVotes.splice(index, 1);

					dispatchAuth({ type: 'UPDATE_USER', payload: { downVotes: newDownVotes } });

					updateUserDb({ downVotes: newDownVotes });
					await updateDoc(doc(db, process.env.REACT_APP_BUILDSDB, build.id), { downVotes: (build.downVotes -= 1), lastModified: serverTimestamp() });
					await updateDoc(doc(db, 'users', build.uid), { rocketReputation: increment(1) });
					await updateDoc(doc(db, 'userProfiles', build.uid), { rocketReputation: increment(1) });
				} else {
					newDownVotes.push(build.id);
					dispatchAuth({ type: 'UPDATE_USER', payload: { downVotes: newDownVotes } });

					updateUserDb({ downVotes: newDownVotes });
					await updateDoc(doc(db, process.env.REACT_APP_BUILDSDB, build.id), { downVotes: (build.downVotes += 1), lastModified: serverTimestamp() });
					await updateDoc(doc(db, 'users', build.uid), { rocketReputation: increment(-1) });
					await updateDoc(doc(db, 'userProfiles', build.uid), { rocketReputation: increment(-1) });

					await updateWeeklyUpvoted(build.id, 'remove');

					// If the user has this upvoted but wants to downvote it, remove the upvote
					if (newUpVotes.includes(build.id)) {
						const index = newUpVotes.indexOf(build.id);
						newUpVotes.splice(index, 1);

						dispatchAuth({ type: 'UPDATE_USER', payload: { upVotes: newUpVotes } });

						updateUserDb({ upVotes: newUpVotes });
						await updateDoc(doc(db, process.env.REACT_APP_BUILDSDB, build.id), { upVotes: (build.upVotes -= 1), lastModified: serverTimestamp() });
						await updateDoc(doc(db, 'users', build.uid), { rocketReputation: increment(-1) });
						await updateDoc(doc(db, 'userProfiles', build.uid), { rocketReputation: increment(-1) });
					}
				}
			}
		} catch (error) {
			console.log(error);
			toast.error('Something went wrong D:');
		}
	};

	/**
	 * handles adding or removing the users id from the ships upvotes
	 * @param {*} id build id
	 * @param {*} type 'add' or 'remove'
	 */
	const updateWeeklyUpvoted = async (id, type) => {
		try {
			// Change the weekly upvoted amount for this build
			const weeklyUpvotedData = await getDoc(doc(db, 'kspInfo', 'weeklyUpvoted'));
			const weeklyUpvoted = weeklyUpvotedData.data();

			if (type === 'add') {
				if (weeklyUpvotedData.exists()) {
					if (weeklyUpvoted[id]) {
						weeklyUpvoted[id].push(user.uid);
					} else {
						weeklyUpvoted[id] = [user.uid];
					}
					await updateDoc(doc(db, 'kspInfo', 'weeklyUpvoted'), weeklyUpvoted);
				} else {
					await setDoc(doc(db, 'kspInfo', 'weeklyUpvoted'), { [id]: [user.uid] });
				}
			} else if (type === 'remove') {
				if (weeklyUpvotedData.exists()) {
					if (weeklyUpvoted[id]) {
						if (weeklyUpvoted[id].includes(user.uid)) {
							const index = weeklyUpvoted[id].indexOf(user.uid);
							weeklyUpvoted[id].splice(index, 1);
							await updateDoc(doc(db, 'kspInfo', 'weeklyUpvoted'), weeklyUpvoted);
						}
					}
				}
			}
		} catch (error) {
			console.log(error);
		}
	};

	/**
	 * Handles a user favoriting a buildprofile
	 * @param {*} id
	 */
	const handleFavoriting = async id => {
		try {
			let newFavorites = cloneDeep(user.favorites);

			// Check if we already upvoted this (and if so, unupvote it)
			if (newFavorites.includes(id)) {
				const index = newFavorites.indexOf(id);
				newFavorites.splice(index, 1);

				dispatchAuth({ type: 'UPDATE_USER', payload: { favorites: newFavorites } });

				updateUserDb({ favorites: newFavorites });
			} else {
				newFavorites.push(id);
				dispatchAuth({ type: 'UPDATE_USER', payload: { favorites: newFavorites } });

				updateUserDb({ favorites: newFavorites });
			}
		} catch (error) {
			console.log(error);
		}
	};

	/**
	 * Handles adding a new build to the current users state. takes in a build id
	 * @param {*} buildId
	 */
	const addbuildToUser = buildId => {
		dispatchAuth({ type: 'ADD_BUILD', payload: buildId });
	};

	/**
	 * Handles setting if the user is editing their profile
	 * @param {*} editing
	 */
	const setEditingProfile = editing => {
		dispatchAuth({
			type: 'SET_EDITING_PROFILE',
			payload: editing,
		});
	};

	/**
	 * Updates the context if we are fetching a users profile
	 * @param {*} bool
	 */
	const setFetchingProfile = bool => {
		dispatchAuth({
			type: 'SET_FETCHING_PROFILE',
			payload: bool,
		});
	};

	/**
	 * Handles fetching a profile from the userProfiles DB.
	 * @param {*} id
	 */
	const fetchUsersProfile = async id => {
		try {
			setFetchingProfile(true);

			const fetchedProfile = await getDoc(doc(db, 'userProfiles', id));

			if (fetchedProfile.exists()) {
				const profile = fetchedProfile.data();
				profile.uid = fetchedProfile.id;
				dispatchAuth({
					type: 'FETCH_USERS_PROFILE',
					payload: profile,
				});

				setFetchingProfile(false);
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

				// if (!fetchedProfiles.empty) {
				// 	fetchedProfiles.forEach(profile => {
				// 		let userProfile = profile.data();
				// 		userProfile.uid = profile.id;
				// 		profiles.push(userProfile);
				// 	});
				// } else {
				// 	const fetchedProfiles = await getDocs(q);

				// 	fetchedProfiles.forEach(profile => {
				// 		let userProfile = profile.data();
				// 		userProfile.uid = profile.id;
				// 		profiles.push(userProfile);
				// 	});
				// }

				if (profiles.length > 0) {
					const profile = profiles[0];

					dispatchAuth({
						type: 'FETCH_USERS_PROFILE',
						payload: profile,
					});

					setFetchingProfile(false);
				} else {
					setFetchingProfile(false);
					throw new Error(`Couldn't find profile!`);
				}
			}
		} catch (error) {
			console.log(error);
		}
	};

	/**
	 * handles fetching the profile from the server if for some reason fetching from the cache fails
	 * @param {*} id
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

				setFetchingProfile(false);
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

					setFetchingProfile(false);
				} else {
					setFetchingProfile(false);
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

	/**
	 * Handles uploading a profile picture. Adds the URL to a state when its down
	 * @param {*} e
	 * @param {*} setState
	 * @returns
	 */
	const uploadProfilePicture = async (e, setUploadingState) => {
		let convertProfilePic;

		// Shrink the file size
		if (e.target.files) {
			convertProfilePic = await compressAccurately(e.target.files[0], 200);
		}

		return new Promise((resolve, reject) => {
			// make sure we have a file uploaded
			if (e.target.files) {
				const profilePicture = e.target.files[0];

				if (profilePicture.size > 2097152) {
					toast.error('Image is too big! Must be smaller than 2mb');
					e.target.value = null;
					return;
				}

				uploadImage(convertProfilePic, setUploadingState, user.uid).then(url => {
					console.log(url);
					resolve(url);
				});
			}
		});
	};

	/**
	 * Handles a user requesting to reset their password. Shows the reset password modal
	 * @param {*} bool
	 */
	const setResetPassword = bool => {
		dispatchAuth({
			type: 'SET_RESET_PASSWORD',
			payload: bool,
		});
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

			dispatchAuth({
				type: 'UPDATE_USER',
				payload: { notifications: newNotifs },
			});
		} catch (error) {
			console.log(error);
		}
	};

	/**
	 * handles deleting a notification
	 * @param {*} i - index position
	 * @param {*} id -id
	 */
	const handleDeleteNotification = async (index, id) => {
		try {
			let newNotifs = cloneDeep(user.notifications);
			newNotifs.splice(index, 1);

			await deleteDoc(doc(db, 'users', user.uid, 'notifications', id)).catch(err => console.log(err));
			dispatchAuth({ type: 'UPDATE_USER', payload: { notifications: newNotifs } });
		} catch (error) {
			console.log(error);
		}
	};

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
			dispatchAuth({ type: 'UPDATE_USER', payload: { notifications: [] } });
		} catch (error) {
			console.log(error);
			return;
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

			// if (!notifsSnap.empty) {
			// 	notifsSnap.forEach(doc => {
			// 		const notif = doc.data();
			// 		notifs.push(notif);
			// 	});
			// } else {
			// 	const notifsSnap = await getDocs(q);

			// 	notifsSnap.forEach(doc => {
			// 		const notif = doc.data();
			// 		notifs.push(notif);
			// 	});
			// }

			dispatchAuth({
				type: 'UPDATE_USER',
				payload: { notifications: [...user.notifications, ...notifs] },
			});

			dispatchAuth({
				type: 'SET_AUTH',
				payload: { lastFetchedNotification: notifsSnap.docs.length < process.env.REACT_APP_NOTIFS_FETCH_NUM ? 'end' : notifsSnap.docs[notifsSnap.docs.length - 1], notificationsLoading: false },
			});
		} catch (error) {
			console.log(error);
		}
	};

	/**
	 * handles deleting a user
	 * @param {*} id
	 */
	const deleteUserAccount = async uid => {
		try {
			// Delete the notifications
			const notifQuery = query(collection(db, 'users', uid, 'notifications'));
			const notifQuerySnapshot = await getDocs(notifQuery);
			notifQuerySnapshot.forEach(notif => {
				deleteDoc(doc(db, 'users', uid, 'notifications', notif.id));
			});

			const userRef = await getDoc(doc(db, 'users', uid));
			const userData = userRef.data();

			// Delete the users username
			await deleteDoc(doc(db, 'usernames', userData.username));
			// Delete the users profile
			await deleteDoc(doc(db, 'userProfiles', uid));
			// Delete the user
			await deleteDoc(doc(db, 'users', uid));

			const userAuth = getAuth();

			if (accountToDelete === user.uid) {
				await deleteUser(accountToDelete);
			} else {
				await setDoc(doc(db, 'BlockList', accountToDelete), { timestamp: serverTimestamp() });
			}

			const statsData = await getDoc(doc(db, 'adminPanel', 'stats'));
			const stats = statsData.data();
			await updateDoc(doc(db, 'adminPanel', 'stats'), { users: (stats.users -= 1) });

			toast.success('Account Deleted.');
		} catch (error) {
			console.log(error);
		}
	};

	/**
	 * Handles removing a conversation from a user. Doesn't delete the actual conversation
	 * @param {*} id
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

	/**
	 * Handles setting the id for the convo to delete
	 * @param {*} id
	 */
	const handleDeleteConversationId = id => {
		dispatchAuth({
			type: 'SET_DELETE_CONVO_ID',
			payload: id,
		});
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
				setNewSignup(true);
				createNewUserAccount(name, email, uid, createdAt);
			}
		} catch (error) {
			console.log(error);
			toast.error('Something went wrong. Please try again');
		}
	};

	/**
	 * Handles creating a new email account
	 * @param {*} newUser - takes in the formdata for a new user
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

			setNewSignup(true);
			createNewUserAccount(name, email, uid, createdAt);
		} catch (error) {
			console.log(error);
			return error;
		}
	};

	/**
	 * Sets the id of the account to delete
	 * @param {*} id
	 */
	const setAccountToDelete = id => {
		dispatchAuth({
			type: 'SET_ACCOUNT_TO_DELETE',
			payload: id,
		});
	};

	/**
	 * handles sending a user a notification
	 * @param {*} uid
	 * @param {*} notification
	 */
	const sendNotification = async (uid, notification) => {
		try {
			const userRef = collection(db, 'users', uid, 'notifications');
			await addDoc(userRef, notification);
		} catch (error) {
			console.log(error);
			return;
		}
	};

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

	/**
	 * Handles setting a report
	 */
	const setReport = (type, content) => {
		dispatchAuth({
			type: 'SET_REPORT',
			payload: {
				reportingContent: content,
				reportType: type,
			},
		});
	};

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
		} catch (error) {
			console.log(error);
		}
	};

	/**
	 * Handles sending a message to a user
	 * @param {*} id
	 * @param {*} uid
	 * @param {*} message
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
					dispatchAuth({
						type: 'SET_MESSAGE_TAB',
						payload: convoData,
					});
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

				dispatchAuth({
					type: 'SET_MESSAGE_TAB',
					payload: conversation,
				});
			}
		} catch (error) {
			toast.error('Something went wrong. Please try again');
			console.log(error);
		}
	};

	/**
	 * Handles checking if we have a conversation with this user, or if its a new one
	 * @param {*} userProfile
	 * @returns
	 */
	const fetchConversation = userProfile => {
		try {
			const messageBox = document.getElementById('messageBox');
			const conversationBox = document.getElementById('conversationBox');

			let foundConvo = null;
			conversations?.map(convo => {
				if (convo.users.includes(userProfile.uid)) foundConvo = convo;
			});

			if (foundConvo) {
				setMessageTab(foundConvo);
				conversationBox.classList.add('dropdown-open');
				messageBox.focus();
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
						dispatchAuth({
							type: 'NEW_CONVO',
							payload: foundConvo,
						});
						setMessageTab(foundConvo);
						messageBox.focus();
						conversationBox.classList.add('dropdown-open');
					} else {
						setMessageTab({
							users: [user.uid, userProfile.uid],
							lastMessage: null,
							messages: [],
							userProfilePic: userProfile?.profilePicture,
							username: userProfile.username,
							id: null,
						});
						messageBox.focus();
						conversationBox.classList.add('dropdown-open');
					}
				});
			}
		} catch (error) {
			console.log(error);
		}
	};

	/**
	 * Handles setting the current covnersation message
	 * @param {*} convo
	 */
	const setMessageTab = convo => {
		dispatchAuth({
			type: 'SET_MESSAGE_TAB',
			payload: {
				messageTab: convo,
			},
		});
	};

	/**
	 * Handles when a user has 'read' a new message
	 */
	const readMessage = async convo => {
		try {
			await updateDoc(doc(db, 'users', user.uid, 'messages', convo.id), { newMessage: false });
		} catch (error) {
			console.log(error);
		}
	};

	/**
	 * Handles setting a report
	 */
	const setHoverUser = value => {
		dispatchAuth({
			type: 'SET_HOVER_USER',
			payload: value,
		});
	};

	/**
	 * Handles setting the id of the user we want to block.
	 * @param {*} id
	 */
	const setUserToBlock = id => {
		dispatchAuth({
			type: 'SET_USER_TO_BLOCK',
			payload: id,
		});
	};

	/**
	 * Handles setting the newSub state
	 */
	const setNewSub = () => {
		dispatchAuth({
			type: 'SET_AUTH',
			payload: {
				newSub: false,
			},
		});
	};

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

					updateUserDb({ blockList: newBlockList, lastModified: serverTimestamp() });
					await updateDoc(doc(db, 'userProfiles', user.uid), { blockList: newBlockList, lastModified: serverTimestamp() });

					toast.success('User unblocked.');
				} else {
					newBlockList.push(userToBlock);

					updateUserDb({ blockList: newBlockList, lastModified: serverTimestamp() });
					await updateDoc(doc(db, 'userProfiles', user.uid), { blockList: newBlockList, lastModified: serverTimestamp() });

					toast.success('User blocked.');
				}
			} else {
				newBlockList = [userToBlock];

				updateUserDb({ blockList: newBlockList, lastModified: serverTimestamp() });
				await updateDoc(doc(db, 'userProfiles', user.uid), { blockList: newBlockList, lastModified: serverTimestamp() });

				toast.success('User blocked.');
			}

			dispatchAuth({
				type: 'UPDATE_USER',
				payload: { blockList: newBlockList },
			});

			dispatchAuth({
				type: 'SET_USER_TO_BLOCK',
				payload: null,
			});
		} catch (error) {
			console.log(error);
		}
	};

	/**
	 * handles saving the username color
	 */
	const updateUsernameColor = async color => {
		try {
			await updateDoc(doc(db, 'users', user.uid), { customUsernameColor: color, lastModified: serverTimestamp() });
			await updateDoc(doc(db, 'userProfiles', user.uid), { customUsernameColor: color, lastModified: serverTimestamp() });

			toast.success('Color updated!');
		} catch (error) {
			console.log(error);
			toast.error('Something went wrong, please try again');
		}
	};

	return {
		handleVoting,
		handleDeleteNotification,
		handleDeleteAllNotifications,
		handleFavoriting,
		handleFollowingUser,
		handleDeleteConversationId,
		addbuildToUser,
		setResetPassword,
		setNewSignup,
		setNotificationsRead,
		setEditingProfile,
		setNewSub,
		setMessageTab,
		setAccountToDelete,
		setReport,
		setHoverUser,
		setUserToBlock,
		updateUserState,
		updateUserDbBio,
		updateUserDb,
		updateUserProfiles,
		updateUserDbProfilePic,
		updateUserProfilePicture,
		updateUsernameColor,
		deleteUserAccount,
		deleteConversation,
		fetchUsersProfile,
		fetchConversation,
		fetchMoreNotifications,
		uploadProfilePicture,
		createNewUserAccount,
		loginWithGoogle,
		newEmailAccount,
		sendNotification,
		sendMessage,
		submitReport,
		readMessage,
		blockUser,
	};
};

export default useAuth;
