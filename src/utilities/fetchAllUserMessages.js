import { collection, getDocs, getDoc, doc, query, where } from 'firebase/firestore';
import { db, auth } from '../firebase.config';

/**
 * handles fetching a users messages from their own DB
 */
const fetchAllUserMessages = async () => {
	try {
		const userMessagesRef = query(collection(db, `users`, auth.currentUser.uid, 'messages'), where('id', '!=', 'first'));
		const usersMessagesData = await getDocs(userMessagesRef);
		let usersMessages = usersMessagesData.docs.map(doc => {
			const convo = doc.data();
			convo.id = doc.id;
			return convo;
		});
		return usersMessages;
	} catch (error) {
		console.log(error);
	}
};

/**
 * Handles fetching a single message from a users own DB
 * @param {*} id
 * @returns
 */
const fetchUserMessage = async id => {
	try {
		const fetchedMessageRef = await getDoc(doc(db, 'users', auth.currentUser.uid, 'messages', id));

		if (fetchedMessageRef.exists()) {
			const messageData = fetchedMessageRef.data();
			return messageData;
		} else {
			return null;
		}
	} catch (error) {
		console.log(error);
	}
};

export default fetchAllUserMessages;
