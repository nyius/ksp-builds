import React from 'react';

/**
 * Displays a messages timestamp
 * @param {*} timestamp
 * @returns
 */
function MessageTimestamp({ timestamp }) {
	const optionsShort = {
		hour: '2-digit',
		minute: '2-digit',
		hour12: true,
	};

	const optionsLong = {
		year: '2-digit',
		month: 'numeric',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: true,
	};

	const currentTime = Date.now();
	const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

	const displayTimestamp = () => {
		if (typeof timestamp === 'string') {
			const date = new Date(timestamp);

			const differenceInMilliseconds = currentTime - date;
			if (differenceInMilliseconds > oneDayInMilliseconds) {
				return date.toLocaleString('en-US', optionsLong);
			} else {
				return date.toLocaleString('en-US', optionsShort);
			}
		} else {
			const differenceInMilliseconds = currentTime - timestamp;

			if (differenceInMilliseconds > oneDayInMilliseconds) {
				return timestamp.toLocaleString('en-US', optionsLong);
			} else {
				return timestamp.toLocaleString('en-US', optionsShort);
			}
		}
	};
	return <time className="text-lg 2k:text-xl opacity-50">{displayTimestamp()}</time>;
}

export default MessageTimestamp;
