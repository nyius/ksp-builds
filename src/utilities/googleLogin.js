import { signInWithPopup } from 'firebase/auth';
import { auth, db, googleProvider } from '../firebase.config';
import { serverTimestamp, doc, getDoc, setDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import { cloneDeep } from 'lodash';
import standardNotifications from './standardNotifications';
import standardUser from './standardUser';
import standardUserProfile from './standardUserProfile';

// Handles logging in with a google account
const googleLogin = async () => {
	try {
		const userCredential = await signInWithPopup(auth, googleProvider).catch(err => {
			console.log(err);
			toast.error('Something went wrong. Please try again');
			return;
		});

		// Get user information.
		const uid = userCredential.user.uid;
		const name = userCredential.user.displayName;
		const email = userCredential.user.email;
		const createdAt = serverTimestamp();

		const userRef = doc(db, 'users', uid);
		const userSnap = await getDoc(userRef);

		// Check if the user exists
		if (userSnap.exists()) {
			return 'success';
		} else {
			// If the user doesn't exist, create them in the DB
			let user = cloneDeep(standardUser);
			let notifications = cloneDeep(standardNotifications);
			let userProfile = cloneDeep(standardUserProfile);

			user.name = name;
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
		}
	} catch (error) {
		console.log(error);
	}
};

export default googleLogin;
