import { getDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase.config';
import { createDateFromFirebaseTimestamp } from './createDateFromFirebaseTimestamp';
import errorReport from './errorReport';

/**
 * Fetches all of a users conversations that exist
 */
const fetchAllUsersConvos = async usersConvos => {
	try {
		let fetchedConvos = [];

		await Promise.all(
			usersConvos.map(async convo => {
				let fetchedConvoRef = await getDoc(doc(db, 'conversations', convo.id));

				if (fetchedConvoRef.exists()) {
					let fetchedConvoData = fetchedConvoRef.data();
					fetchedConvoData.id = convo.id;
					fetchedConvoData.lastMessage = createDateFromFirebaseTimestamp(convo.lastMessage.seconds, 'long');

					// Fetch the other users profile
					const userToFetch = fetchedConvoData.users.filter(user => {
						return user !== auth.currentUser.uid;
					})[0];

					const userFetch = await getDoc(doc(db, 'userProfiles', userToFetch));
					const userData = userFetch.data();
					let blocked;
					if (userData?.blockList?.includes(auth.currentUser.uid)) blocked = true;
					fetchedConvoData.userProfilePic = userData.profilePicture;
					fetchedConvoData.username = userData.username;
					fetchedConvoData.uid = userFetch.id;
					fetchedConvoData.otherUser = userToFetch;
					fetchedConvoData.messages = [];
					fetchedConvoData.blocked = blocked;
					fetchedConvos.push(fetchedConvoData);
				}
			})
		);

		return fetchedConvos;
	} catch (error) {
		errorReport(error.message, true, 'fetchAllUsersConvos');
	}
};

export default fetchAllUsersConvos;
