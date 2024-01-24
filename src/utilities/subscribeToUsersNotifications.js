import { collection, where, query, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase.config';
import errorReport from './errorReport';

/**
 * Handles subscribing to a users notifications to listen for a new notif
 * @param {*} dispatchAuth
 */
const subscribeToUsersNotifications = async dispatchAuth => {
	try {
		// Listen to current users messages to know if we get a new one -------------------------------------------------------------------------------------------------------------------------------------------------
		const userNotifsQuery = query(collection(db, 'users', auth.currentUser.uid, 'notifications'));
		onSnapshot(userNotifsQuery, querySnapshot => {
			querySnapshot.docChanges().forEach(change => {
				if (change.type === 'added') {
					let newIncomingNotif = change.doc.data();
					newIncomingNotif.id = change.doc.id;

					if (newIncomingNotif.read === false) {
						dispatchAuth({
							type: 'NEW_NOTIFICATION',
							payload: newIncomingNotif,
						});
					}
				}
			});
		});
	} catch (error) {
		errorReport(error.message, true, 'subscribeToUsersNotifications');
	}
};

export default subscribeToUsersNotifications;
