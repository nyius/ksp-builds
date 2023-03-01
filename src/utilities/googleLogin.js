import { signInWithPopup } from 'firebase/auth';
import { auth, db, googleProvider } from '../firebase.config';
import { serverTimestamp, doc, getDoc, setDoc } from 'firebase/firestore';

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
			// If the user doesn't exist

			const user = {
				name,
				email,
				username: '',
				notificationsAllowed: true,
				commentNotificationsAllowed: true,
				bio: '',
				favorites: [],
				profilePicture: 'https://firebasestorage.googleapis.com/v0/b/ludwig-7aa98.appspot.com/o/default-profile.png?alt=media&token=2c13690f-bee9-45d4-90d9-92371361c4ff',
				siteAdmin: false,
				dateCreated: createdAt,
			};

			await setDoc(doc(db, 'users', uid), user);

			return 'newUser';
		}
	} catch (error) {
		console.log(error);
	}
};

export default googleLogin;
