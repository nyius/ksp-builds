import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase.config';
import errorReport from './errorReport';

/**
 * Handles logging in with email
 * @param {*} email
 * @param {*} password
 */
const emailLogin = async (email, password) => {
	try {
		await signInWithEmailAndPassword(auth, email, password);
	} catch (error) {
		if (!error.message.includes('wrong-password') || error.message !== 'Firebase: Error (auth/user-not-found).') {
			errorReport(`email:${email} | error: ${error.message}`, true, 'emailLogin');
		} else {
			errorReport(error.message, false, 'emailLogin');
		}
		return error.message;
	}
};

export default emailLogin;
