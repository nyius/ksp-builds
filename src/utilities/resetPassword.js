import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase.config';
import { toast } from 'react-toastify';
import errorReport from './errorReport';

/**
 * Handles sending a reset password to the users email
 * @param {*} email
 */
const resetPassword = async email => {
	try {
		await sendPasswordResetEmail(auth, email);
		toast.success('Email sent!');
	} catch (error) {
		errorReport(error.message, true, 'resetPassword');
	}
};

export default resetPassword;
