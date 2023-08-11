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
		errorReport(error.message, true, 'emailLogin');
		return error.message;
	}
};

export default emailLogin;
