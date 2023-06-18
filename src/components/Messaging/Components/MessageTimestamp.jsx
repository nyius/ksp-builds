import React from 'react';

/**
 * Displays a messages timestamp
 * @param {*} timestamp
 * @returns
 */
function MessageTimestamp({ timestamp }) {
	return <time className="text-lg 2k:text-xl opacity-50">{timestamp}</time>;
}

export default MessageTimestamp;
