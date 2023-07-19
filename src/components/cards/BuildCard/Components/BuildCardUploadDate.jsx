import React from 'react';
import { createDateFromFirebaseTimestamp } from '../../../../utilities/createDateFromFirebaseTimestamp';

/**
 * Displays the date the build was uploaded
 * @param {timestamp} timestamp - the firebase timestamp ({ seconds, nanoseconds })
 * @returns
 */
function BuildCardUploadDate({ timestamp }) {
	return <div className="flex items-center h-full text-slate-400 text-lg 2k:text-xl sm:text-lg italic">{createDateFromFirebaseTimestamp(timestamp.seconds)}</div>;
}

export default BuildCardUploadDate;
