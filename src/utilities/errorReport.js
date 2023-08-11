import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';
import { auth } from '../firebase.config';

/**
 * Handles Logging an error to the console. Also sends an error to the server (optional)
 * @param {error} error - error to log
 * @param {bool} sendToServer - (optional) - whether or not to send this error to the server
 * @param {string} func - (optional) - the name of the function that caused the error
 */
const errorReport = (error, sendToServer, func) => {
	const errorReport = {
		error,
		func,
		date: serverTimestamp(),
		url: window.location.href,
		uid: auth?.currentUser ? auth.currentUser : null,
	};

	console.error(errorReport);

	if (sendToServer) {
		sendErrorToServer(errorReport);
	}
};

const sendErrorToServer = async errorReport => {
	try {
		await addDoc(collection(db, 'errorReports'), errorReport);
	} catch (error) {
		console.error(error);
	}
};

export default errorReport;
