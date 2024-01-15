import React from 'react';

/**
 * Displaus an accolade image in the notification
 * @param {*} notif
 * @returns
 */
function NotifAccoladeIcon({ notif }) {
	if (!notif.image) return;
	return (
		<div>
			<img src={notif.image} alt="" className="w-36 h-36" />
		</div>
	);
}

export default NotifAccoladeIcon;
