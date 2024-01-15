import React from 'react';
import { useAuthContext } from '../../../context/auth/AuthContext';
import { useUpdateProfile } from '../../../context/auth/AuthActions';
import { toast } from 'react-toastify';
import NotificationOption from './NotificationOption';
import { updateUserDb } from '../../../context/auth/AuthUtils';

/**
 * Nitofications settings component
 * @returns
 */
function Notifications() {
	const { user, dispatchAuth } = useAuthContext();

	/**
	 * Listens for changes for notifications
	 * @param {event} e
	 */
	const handleNotificationsChange = e => {
		if (e.target.id === 'blockAll') {
			if (e.target.checked) {
				const userBlockedNotifs = ['comment', 'reply', 'newBuild', 'update', 'challenge'];
				updateUserDb(dispatchAuth, { blockedNotifications: userBlockedNotifs, notificationsAllowed: false }, user.uid);
				toast.success('Saved');
			} else {
				updateUserDb(dispatchAuth, { blockedNotifications: [], notificationsAllowed: true }, user.uid);
				toast.success('Saved');
			}
		} else {
			if (user.blockedNotifications) {
				// check if they want that notification. If they do, remove it from their blocked array
				if (e.target.checked) {
					const userBlockedNotifs = [...user.blockedNotifications.filter(el => el !== e.target.id)];
					updateUserDb(dispatchAuth, { blockedNotifications: userBlockedNotifs }, user.uid);
					toast.success('Saved');
				} else {
					// If they're unchecking it, add it to their blocked notifs
					const userBlockedNotifs = [...user.blockedNotifications, e.target.id];
					updateUserDb(dispatchAuth, { blockedNotifications: userBlockedNotifs }, user.uid);
					toast.success('Saved');
				}
			} else {
				updateUserDb(dispatchAuth, { blockedNotifications: [e.target.id] }, user.uid);
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
			<NotificationOption handleChange={handleNotificationsChange} text="New Accolade" id="accolade" />
			<NotificationOption handleChange={handleNotificationsChange} text="Block All Notifications" id="blockAll" />
		</div>
	);
}

export default Notifications;
