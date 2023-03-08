import { auth } from '../firebase.config';
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { serverTimestamp, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { cloneDeep } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
//---------------------------------------------------------------------------------------------------//
import standardNotifications from './standardNotifications';
import standardUser from './standardUser';
import standardUserProfile from './standardUserProfile';

/**
 * Handles creating a new email account
 * @param {*} newUser
 */
const newEmailAccount = async newUser => {
	try {
		const userCredential = await createUserWithEmailAndPassword(auth, newUser.email, newUser.password).catch(err => {
			if (err.code.includes('already-in-use')) {
				toast.error('Account already exists!');
				throw new Error('exists');
			}
			return;
		});
		const email = userCredential.user.email;
		const uid = userCredential.user.uid;

		// If the user doesn't exist, create them in the DB
		let user = cloneDeep(standardUser);
		let notifications = cloneDeep(standardNotifications);
		let userProfile = cloneDeep(standardUserProfile);
		const createdAt = serverTimestamp();

		user.email = email;
		user.dateCreated = createdAt;

		notifications.type = 'welcome';
		notifications.username = 'nyius';
		notifications.uid = 'MMWg1Vzq4EWE0mmaqFI8NHf50Hy2';
		notifications.timestamp = createdAt;
		notifications.read = false;
		notifications.profilePicture = 'https://firebasestorage.googleapis.com/v0/b/kspbuilds.appspot.com/o/selfie.png?alt=media&token=031dfd32-5038-4c84-96c3-40b09c0e4529';
		notifications.message = 'Welcome to KSP Builds! Please feel free to reach out with any questions/comments/ideas, and fly safe!';

		userProfile.dateCreated = createdAt;

		await setDoc(doc(db, 'users', uid), user);
		await setDoc(doc(db, 'users', uid, 'notifications', uuidv4().slice(0, 20)), notifications);
		await setDoc(doc(db, 'userProfiles', uid), userProfile);

		return 'newUser';
	} catch (error) {
		console.log(error);
		return error;
	}
};

export default newEmailAccount;
