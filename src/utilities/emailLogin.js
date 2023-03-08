import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase.config';

/**
 * Handles logging in with email
 * @param {*} username
 * @param {*} password
 */
const emailLogin = async (username, password) => {
	await signInWithEmailAndPassword(auth, username, password).catch(err => {
		console.log(err);
	});
};

export default emailLogin;
