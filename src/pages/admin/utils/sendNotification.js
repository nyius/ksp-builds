import { toast } from 'react-toastify';
import { collection, getDocs } from 'firebase/firestore';
import { cloneDeep } from 'lodash';
import { sendNotification } from '../../../context/auth/AuthUtils';
import standardNotifications from '../../../utilities/standardNotifications';
import { db } from '../../../firebase.config';

/**
 * Handles sending a message to everyone on the site
 * @param {*} notification  - the notification to send (probably in draftjs fortmat)
 * @param {*} type - the type of notification
 * @param {*} user - the current logged in admins UID
 * @returns
 */
export const sendSiteMessage = async (notification, type, user) => {
	try {
		if (!notification) {
			toast.error('Forgot a message');
			return;
		}

		const usersRef = collection(db, 'users');
		const usersSnap = await getDocs(usersRef);

		const newNotif = cloneDeep(standardNotifications);
		newNotif.uid = user.uid;
		newNotif.username = user.username;
		newNotif.timestamp = new Date();
		newNotif.profilePicture = user.profilePicture;
		newNotif.message = notification;
		newNotif.type = type;
		delete newNotif.buildId;
		delete newNotif.buildName;
		delete newNotif.comment;
		delete newNotif.commentId;

		usersSnap.forEach(user => {
			sendNotification(user.id, newNotif);
		});

		// sendNotification('ZyVrojY9BZU5ixp09LftOd240LH3', newNotif);
		toast.success('Message sent!');
	} catch (error) {
		console.log(error);
	}
};
