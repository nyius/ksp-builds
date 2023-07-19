import React from 'react';
import Button from '../../buttons/Button';
import { useAuthContext } from '../../../context/auth/AuthContext';
import { useHandleNotifications } from '../../../context/auth/AuthActions';

/**
 * Displays the button for deleting all notifications
 * @returns
 */
function DeleteAllNotifsBtn() {
	const { user } = useAuthContext();
	const { handleDeleteAllNotifications } = useHandleNotifications();

	if (user?.notifications.length > 0) {
		return <Button text="Delete All" position="absolute top-2 right-2" color="bg-base-900" onClick={handleDeleteAllNotifications} />;
	}
}

export default DeleteAllNotifsBtn;
