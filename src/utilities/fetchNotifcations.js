import { db, auth } from '../firebase.config';
import { collection, orderBy, getDocs, deleteDoc, limit, query, doc } from 'firebase/firestore';

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
		console.log(error);
	}
};

export default fetchNotifications;
