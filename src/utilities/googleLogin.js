import { signInWithPopup } from 'firebase/auth';
import { auth, db, googleProvider } from '../firebase.config';
import { serverTimestamp, doc, getDoc, setDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

// Handles logging in with a google account
const googleLogin = async () => {
	try {
		const userCredential = await signInWithPopup(auth, googleProvider);

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
			const user = {
				name,
				email,
				username: '',
				notificationsAllowed: true,
				commentNotificationsAllowed: true,
				bio: '',
				favorites: [],
				profilePicture: '',
				siteAdmin: false,
				dateCreated: createdAt,
			};

			const notifications = {
				type: 'welcome',
				username: 'KSP_Builds',
				uid: 123,
				timestamp: createdAt,
				read: false,
				profilePicture: 'https://firebasestorage.googleapis.com/v0/b/kspbuilds.appspot.com/o/logo_light_icon.png?alt=media&token=bbcff4bd-de9e-4d39-b77e-7046f90ed832',
				message: 'Welcome to KSP Builds! Please feel free to reach out with any questions/comments/ideas, and fly safe!',
			};

			await setDoc(doc(db, 'users', uid), user);
			await setDoc(doc(db, 'users', uid, 'notifications', uuidv4().slice(0, 20)), notifications);

			return 'newUser';
		}
	} catch (error) {
		console.log(error);
	}
};

export default googleLogin;
