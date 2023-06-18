import React from 'react';
import Button from '../../buttons/Button';
import { useHandleNotifications } from '../../../context/auth/AuthActions';

/**
 * Displays a button for deleting a notification
 * @param {*} i
 * @param {*} id - notif id to delete
 * @returns
 */
function DeleteNotifBtn({ i, id }) {
	const { handleDeleteNotification } = useHandleNotifications();

	return <Button onClick={() => handleDeleteNotification(i, id)} id="deleteBtn" text="x" size="absolute right-0 bottom-0 z-50 " color="text-white" />;
}

export default DeleteNotifBtn;
