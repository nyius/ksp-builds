import React from 'react';
import { useAuthContext } from '../../../context/auth/AuthContext';

/**
 * Displays an option for a notification
 * @param {function} handleChange - the function that handles changing a notification
 * @param {string} text - The text to display next to the checkbox
 * @param {string} id - The id of the notification
 * @returns
 */
function NotificationOption({ handleChange, text, id }) {
	const { user } = useAuthContext();

	return (
		<label className="cursor-pointer label w-fit gap-2">
			<input id={id} onChange={handleChange} type="checkbox" defaultChecked={user.blockedNotifications?.includes(id) ? false : true} className="checkbox checkbox-success" />
			<span className="label-text text-xl 2k:text-2xl">{text}</span>
		</label>
	);
}

export default NotificationOption;
