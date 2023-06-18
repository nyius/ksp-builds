import React from 'react';
import { MdOutlineNotificationsNone } from 'react-icons/md';
import { useHandleNotifications } from '../../../context/auth/AuthActions';

/**
 * Displays the notification icon
 * @returns
 */
function NotificationsIcon() {
	const { setNotificationsRead } = useHandleNotifications();

	return (
		<label onClick={setNotificationsRead} tabIndex={4} className="btn btn-circle w-14 h-14 2k:w-20 2k:h-20 2k:btn-lg avatar">
			<p className="text-4xl">
				<MdOutlineNotificationsNone />
			</p>
		</label>
	);
}

export default NotificationsIcon;
