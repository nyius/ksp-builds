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
				profilePicture: 'https://firebasestorage.googleapis.com/v0/b/kspbuilds.appspot.com/o/logo_light_icon.png?alt=media&token=bbcff4bd-de9e-4d39-b77e-7046f90ed832',
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
