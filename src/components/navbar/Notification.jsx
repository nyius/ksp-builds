import React from 'react';

function Notification({ notif }) {
	const timestamp = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(notif.timestamp.seconds * 1000);

	return (
		<div className="flex flex-col p-4 2k:p-6 rounded-xl border-2 border-solid border-slate-500">
			<div className="flex flex-row flex-wrap place-content-between">
				<p className="text-xl 2k:text-2xl font-bold text-white">{notif.username}</p>
				<p className="italic text-lg 2k:text-xl text-slate-400">{timestamp}</p>
			</div>
			{notif.type === 'comment' && <p className="text-xl 2k:text-2xl">{notif.comment}</p>}
			{notif.type === 'welcome' && <p className="text-xl 2k:text-2xl">{notif.message}</p>}
			{notif.type === 'message' && <p className="text-xl 2k:text-2xl">{notif.message}</p>}
		</div>
	);
}

export default Notification;
