import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../../../context/auth/AuthContext';

/**
 * Displays an icon if the user has a new notification
 * @returns
 */
function NewNotificationIcon() {
	const { authLoading, user } = useContext(AuthContext);
	const [totalUnread, setTotalUnread] = useState(0);

	/**
	 * Calculates total unread notifications
	 */
	const calcUnreadNotifs = () => {
		setTotalUnread(0);
		user.notifications.map(notif => {
			if (!notif.read) {
				setTotalUnread(prevstate => (prevstate += 1));
			}
		});
	};

	useEffect(() => {
		if (!authLoading && user?.username) {
			if (user.notifications) {
				calcUnreadNotifs();
			}
		}
	}, [authLoading, user]);

	if (totalUnread > 0) {
		return <span className="indicator-item indicator-bottom indicator-start badge badge-secondary 2k:text-2xl 2k:p-4">{totalUnread > 99 ? '99+' : totalUnread}</span>;
	}
}

export default NewNotificationIcon;
