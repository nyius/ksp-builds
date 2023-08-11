import { toast } from 'react-toastify';

/**
 * Displays a toast popup. Also logs to console the message
 * @param {string} 'success' or 'error'
 * @param {string} message - a message to display
 * @param {string} err - (optional) a error message to log to the console, thats separate from the passed in message
 */
const popup = (type, message, err) => {
	if (type === 'success') {
		toast.success(message);
		console.log(message);
	} else if (type === 'error') {
		toast.error(message);
		err ? console.error(err) : console.error(message);
	}
};

export default popup;
