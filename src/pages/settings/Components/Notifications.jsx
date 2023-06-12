import React, { useContext } from 'react';
import AuthContext from '../../../context/auth/AuthContext';
import { useUpdateProfile } from '../../../context/auth/AuthActions';
import { toast } from 'react-toastify';
import NotificationOption from './NotificationOption';

/**
 * Nitofications settings component
 * @returns
 */
function Notifications() {
	const { user } = useContext(AuthContext);
	const { updateUserDb } = useUpdateProfile();

	/**
	 * Listens for changes for notifications
	 * @param {event} e
	 */
	const handleNotificationsChange = e => {
		if (e.target.id === 'blockAll') {
			if (e.target.checked) {
				const userBlockedNotifs = ['comment', 'reply', 'newBuild', 'update', 'challenge'];
				updateUserDb({ blockedNotifications: userBlockedNotifs, notificationsAllowed: false });
				toast.success('Saved');
			} else {
				updateUserDb({ blockedNotifications: [], notificationsAllowed: true });
				toast.success('Saved');
			}
		} else {
			if (user.blockedNotifications) {
				// check if they want that notification. If they do, remove it from their blocked array
				if (e.target.checked) {
					const userBlockedNotifs = [...user.blockedNotifications.filter(el => el !== e.target.id)];
					updateUserDb({ blockedNotifications: userBlockedNotifs });
					toast.success('Saved');
				} else {
					// If they're unchecking it, add it to their blocked notifs
					const userBlockedNotifs = [...user.blockedNotifications, e.target.id];
					updateUserDb({ blockedNotifications: userBlockedNotifs });
					toast.success('Saved');
				}
			} else {
				updateUserDb({ blockedNotifications: [e.target.id] });
				toast.success('Saved');
			}
		}
	};

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className="flex flex-col gap-2 2k:gap-4">
			<div className="text-xl 2k:text-3xl text-white font-bold">Notifications</div>
			<NotificationOption handleChange={handleNotificationsChange} text="Comments on your builds" id="comment" />
			<NotificationOption handleChange={handleNotificationsChange} text="Replies to your comments" id="reply" />
			<NotificationOption handleChange={handleNotificationsChange} text="Followed users build upload" id="newBuild" />
			<NotificationOption handleChange={handleNotificationsChange} text="Site Updates" id="update" />
			<NotificationOption handleChange={handleNotificationsChange} text="New Challenges" id="challenge" />
			<NotificationOption handleChange={handleNotificationsChange} text="Block All Notifications" id="blockAll" />
		</div>
	);
}

export default Notifications;
