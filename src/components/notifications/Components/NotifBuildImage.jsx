import React from 'react';

/**
 * Displays an image if the notification is a new build
 * @param {*} param0
 * @returns
 */
function NotifBuildImage({ notif }) {
	if (notif.type === 'newBuild') {
		return (
			<div className="flex flex-row gap-2 2k:gap-4 items-center">
				<img src={notif.thumbnail} className="h-44 border-solid border-2 border-slate-800" alt="" />
				<p className="text-xl 2k:text-3xl multi-line-truncate">{notif.buildName} </p>
			</div>
		);
	}
}

export default NotifBuildImage;
