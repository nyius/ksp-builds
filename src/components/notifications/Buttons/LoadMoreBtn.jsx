import React from 'react';
import Button from '../../buttons/Button';
import { useHandleNotifications } from '../../../context/auth/AuthActions';
import { useAuthContext } from '../../../context/auth/AuthContext';

/**
 * Button for loading more notifs
 * @returns
 */
function LoadMoreBtn() {
	const { fetchMoreNotifications } = useHandleNotifications();
	const { lastFetchedNotification } = useAuthContext();

	if (lastFetchedNotification !== 'end') {
		return <Button type="button" text="Load More" icon="reset" color="btn-primary" onClick={fetchMoreNotifications} />;
	}
}

export default LoadMoreBtn;
