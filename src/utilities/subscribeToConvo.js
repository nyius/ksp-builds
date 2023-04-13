import { onSnapshot, collection } from 'firebase/firestore';
import { db } from '../firebase.config';

/**
 * Handles subscribing to a convo to listen for any changes on the DB. This automatically grabs all items from the DB and adds them to the convo
 * @param {*} id
 */
const subscribeToConvo = async (id, dispatchAuth) => {
	try {
		// Subscribe to the conversations messages so we can listen to  any new messages
		// This automatically grabs all messages from the DB upon listening
		const messagesQuery = collection(db, `conversations`, id, 'messages');
		const unsubscribeMessage = onSnapshot(messagesQuery, querySnapshot => {
			querySnapshot.docChanges().forEach(change => {
				if (change.type === 'added') {
					let newMessage = change.doc.data();

					newMessage.timestamp = new Intl.DateTimeFormat('en-US', { year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(
						newMessage.timestamp ? newMessage.timestamp.seconds * 1000 : new Date()
					);

					dispatchAuth({
						type: 'NEW_MESSAGE',
						payload: newMessage,
					});
				}
			});
		});

		return unsubscribeMessage;
	} catch (error) {
		console.log(error);
	}
};

export default subscribeToConvo;
