import React from 'react';

function Notification({ notif }) {
	return (
		<div className="flex flex-col p-4 2k:p-6 rounded-xl border-2 border-solid border-slate-500">
			<p className="text-xl 2k:text-2xl">{notif.username}</p>
			<p className="text-xl 2k:text-2xl">{notif.comment}</p>
		</div>
	);
}

export default Notification;
