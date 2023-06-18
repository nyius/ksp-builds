import React from 'react';

/**
 * Displays the date the build was uploaded
 * @param {timestamp} timestamp - the firebase timestamp ({ seconds, nanoseconds })
 * @returns
 */
function BuildCardUploadDate({ timestamp }) {
	return <div className="flex items-center h-full text-slate-400 text-lg 2k:text-xl sm:text-lg italic">{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(timestamp.seconds * 1000)}</div>;
}

export default BuildCardUploadDate;
