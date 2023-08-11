import { getDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase.config';
import subscribeToConvo from './subscribeToConvo';
import errorReport from './errorReport';

/**
 * Fetches all messages from a conversation
 * @param {*} convo
 */
const fetchConvosMessages = async (convo, dispatchAuth) => {
	try {
		// Grab the convo from the logged in user and see if we have a new unread message
		const currentUserMessageFetch = await getDoc(doc(db, 'users', auth.currentUser.uid, 'messages', convo.id));
		if (currentUserMessageFetch.exists()) {
			const currentUserMessageData = currentUserMessageFetch.data();

			convo.newMessage = currentUserMessageData.newMessage;
			convo.unsubscribe = await subscribeToConvo(convo.id, dispatchAuth);
		}
	} catch (error) {
		errorReport(error.message, true, 'fetchConvosMessages');
	}
};

export default fetchConvosMessages;
