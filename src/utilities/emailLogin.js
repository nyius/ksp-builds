import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase.config';

/**
 * Handles logging in with email
 * @param {*} email
 * @param {*} password
 */
const emailLogin = async (email, password) => {
	try {
		await signInWithEmailAndPassword(auth, email, password).catch(err => {
			console.log(err);
			throw new Error(err.code);
		});
	} catch (error) {
		return error.message;
	}
};

export default emailLogin;
