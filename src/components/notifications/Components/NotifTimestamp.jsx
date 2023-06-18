import React from 'react';

/**
 * Displays a notifications timestamp
 * @param {*} timestamp
 * @returns
 */
function NotifTimestamp({ timestamp }) {
	if (timestamp?.seconds) {
		return <div>{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(timestamp.seconds * 1000)}</div>;
	}
}

export default NotifTimestamp;
