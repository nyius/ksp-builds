import React from 'react';
import { useGetNewNotifs } from '../../../context/auth/AuthActions';

/**
 * Displays an icon if the user has a new notification
 * @returns
 */
function NewNotificationIcon() {
	const [totalUnreadNotifs] = useGetNewNotifs(0);

	if (totalUnreadNotifs > 0) {
		return <span className="indicator-item indicator-bottom indicator-start badge badge-secondary 2k:text-2xl 2k:p-4">{totalUnreadNotifs > 99 ? '99+' : totalUnreadNotifs}</span>;
	}
}

export default NewNotificationIcon;
