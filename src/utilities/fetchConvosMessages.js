import { getDoc, doc, getDocs, collection, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase.config';
import subscribeToConvo from './subscribeToConvo';

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
		console.log(error);
	}
};

export default fetchConvosMessages;
