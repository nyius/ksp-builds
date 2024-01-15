import { collection, where, query, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase.config';
import errorReport from './errorReport';

/**
 * Handles subscribing to a users messages DB to listen for any new messages
 * @param {*} dispatchAuth
 */
const subscribeToUsersMessages = async dispatchAuth => {
	try {
		// Listen to current users messages to know if we get a new one -------------------------------------------------------------------------------------------------------------------------------------------------
		const userMessagesQuery = query(collection(db, 'users', auth.currentUser.uid, 'messages'), where('id', '!=', 'first'));
		onSnapshot(userMessagesQuery, querySnapshot => {
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
	} catch (error) {
		errorReport(error.message, true, 'subscribeToUsersMessages');
	}
};

export default subscribeToUsersMessages;
