import React from 'react';
import { createDateFromFirebaseTimestamp } from '../../../utilities/createDateFromFirebaseTimestamp';

/**
 * Displays a notifications timestamp
 * @param {*} timestamp
 * @returns
 */
function NotifTimestamp({ timestamp }) {
	if (timestamp?.seconds) {
		return <div>{createDateFromFirebaseTimestamp(timestamp.seconds, 'long')}</div>;
	}
}

export default NotifTimestamp;
