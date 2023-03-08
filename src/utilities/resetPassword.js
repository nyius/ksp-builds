import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase.config';
import { toast } from 'react-toastify';

/**
 * Handles sending a reset password to the users email
 * @param {*} email
 */
const resetPassword = async email => {
	try {
		await sendPasswordResetEmail(auth, email);
		toast.success('Email sent!');
	} catch (error) {
		console.log(error);
	}
};

export default resetPassword;
