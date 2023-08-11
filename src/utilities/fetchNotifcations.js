import { db, auth } from '../firebase.config';
import { collection, orderBy, getDocs, deleteDoc, limit, query, doc, where, getDocsFromCache } from 'firebase/firestore';
import errorReport from './errorReport';

/**
 * Handles fetching current users notifications. Deletes any notifications that the user filters
 * @param {*} user
 * @param {*} dispatchAuth
 * @returns
 */
const fetchNotifications = async (user, dispatchAuth) => {
	try {
		// Fetch their notifications --------------------------------------------//
		const notificationsRef = collection(db, 'users', auth.currentUser.uid, 'notifications');
		const q = query(notificationsRef, orderBy('timestamp', 'desc', limit(process.env.REACT_APP_NOTIFS_FETCH_NUM)), limit(process.env.REACT_APP_NOTIFS_FETCH_NUM));

		const notificationsSnap = await getDocs(q);
		const notificationsList = [];

		notificationsSnap.forEach(doc => {
			const notif = doc.data();
			notif.id = doc.id;
			notificationsList.push(notif);
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

		// Delete all the notifications that were filtered out
		deleteNotifIds.forEach(async id => {
			await deleteDoc(doc(db, 'users', auth.currentUser.uid, 'notifications', id));
		});

		dispatchAuth({
			type: 'SET_AUTH',
			payload: { lastFetchedNotification: notificationsSnap.docs.length < process.env.REACT_APP_NOTIFS_FETCH_NUM ? 'end' : notificationsSnap.docs[notificationsSnap.docs.length - 1], notificationsLoading: false },
		});

		return filteredNotifications; // Set the notifs
	} catch (error) {
		errorReport(error.message, true, 'fetchNotifications');
	}
};

const fetchAllUsersNotifs = async () => {
	try {
		const notificationsRef = collection(db, 'users', auth.currentUser.uid, 'notifications');
		let q = query(notificationsRef, orderBy('timestamp', 'desc'), limit(1));
		// Get the most recently updated doc
		const newestDocSnap = await getDocs(q);
		let newestDoc;

		newestDocSnap.forEach(doc => {
			newestDoc = doc.data();
		});

		// Fetch the locally saved newest
		const localNewest = JSON.parse(localStorage.getItem('newestNotif'));

		if (localNewest) {
			// check if the local newest update is now older than the last thing updated on the server
			if (localNewest.seconds < newestDoc.timestamp.seconds) {
				let newDocsQ = query(notificationsRef, where('timestamp', '>', new Date(localNewest.seconds * 1000)));
				await getDocs(newDocsQ); // simply getDocs so it updates our cache

				localStorage.setItem('newestNotif', JSON.stringify(newestDoc.timestamp));
			}
		} else {
			// Users first time/ no localNewest saved, fetch all builds so they're cached
			errorReport(`No local stored timestamp`, false, 'fetchAllUsersNotifs');
			await getDocs(notificationsRef);
			localStorage.setItem('newestNotif', JSON.stringify(newestDoc.timestamp));
		}
	} catch (error) {
		errorReport(error.message, true, 'fetchAllUsersNotifs');
	}
};

export default fetchNotifications;
