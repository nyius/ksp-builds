import { updateDoc, doc, serverTimestamp, collection, addDoc, deleteDoc, getDocs, query, getDoc, setDoc } from 'firebase/firestore';
import { deleteUser, getAuth } from 'firebase/auth';
import { toast } from 'react-toastify';
import { db } from '../../firebase.config';
import { compressAccurately } from 'image-conversion';
import { uploadImage } from '../../utilities/uploadImage';

/**
 * Updates server when a user has 'read' a new message
 * @param {string} convoId - the id of the convo to set read message
 * @param {string} userId - user whose convo we want to update
 */
export const readMessage = async (convoId, userId) => {
	try {
		await updateDoc(doc(db, 'users', userId, 'messages', convoId), { newMessage: false });
	} catch (error) {
		console.log(error);
	}
};

/**
 * handles saving the username color
 * @param {string} userId - the id of the user to update
 * @param {string} color - the color to save
 */
export const updateUsernameColor = async (userId, color) => {
	try {
		await updateDoc(doc(db, 'users', userId), { customUsernameColor: color, lastModified: serverTimestamp() });
		await updateDoc(doc(db, 'userProfiles', userId), { customUsernameColor: color, lastModified: serverTimestamp() });

		toast.success('Color updated!');
	} catch (error) {
		console.log(error);
		toast.error('Something went wrong, please try again');
	}
};

/**
 * handles sending a user a notification
 * @param {string} uid - the users uid to send the notif to
 * @param {string} notification - the notification message to send
 */
export const sendNotification = async (uid, notification) => {
	try {
		const userRef = collection(db, 'users', uid, 'notifications');
		await addDoc(userRef, notification);
	} catch (error) {
		console.log(error);
		return;
	}
};

/**
 * handles deleting a user
 * @param {string} uid - uid of the user to delete
 * @param {string} currentUserUid - uid of the current user
 */
export const deleteUserAccount = async (uid, currentUserUid) => {
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

		if (uid === currentUserUid) {
			await deleteUser(uid);
		} else {
			await setDoc(doc(db, 'BlockList', uid), { timestamp: serverTimestamp() });
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
 * Handles uploading a profile picture. Adds the URL to a state when its down
 * @param {event} e - the event (to get the file)
 * @param {function} setUploadingState - a set state function for uploading
 * @param {string} userUid - the uid of the current user
 * @returns
 */
export const uploadProfilePicture = async (e, setUploadingState, userUid) => {
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

			uploadImage(convertProfilePic, setUploadingState, userUid).then(url => {
				console.log(url);
				resolve(url);
			});
		}
	});
};

/**
 * handles adding or removing the users id from the ships upvotes
 * @param {string} id - the build id
 * @param {string} type - 'add' or 'remove'
 * @param {string} userUid - uid of the user voting
 */
export const updateWeeklyUpvoted = async (id, type, userUid) => {
	try {
		// Change the weekly upvoted amount for this build
		const weeklyUpvotedData = await getDoc(doc(db, 'kspInfo', 'weeklyUpvoted'));
		const weeklyUpvoted = weeklyUpvotedData.data();

		if (type === 'add') {
			if (weeklyUpvotedData.exists()) {
				if (weeklyUpvoted[id]) {
					weeklyUpvoted[id].push(userUid);
				} else {
					weeklyUpvoted[id] = [userUid];
				}
				await updateDoc(doc(db, 'kspInfo', 'weeklyUpvoted'), weeklyUpvoted);
			} else {
				await setDoc(doc(db, 'kspInfo', 'weeklyUpvoted'), { [id]: [userUid] });
			}
		} else if (type === 'remove') {
			if (weeklyUpvotedData.exists()) {
				if (weeklyUpvoted[id]) {
					if (weeklyUpvoted[id].includes(userUid)) {
						const index = weeklyUpvoted[id].indexOf(userUid);
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