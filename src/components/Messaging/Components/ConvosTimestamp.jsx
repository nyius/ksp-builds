import React from 'react';

/**
 * Displays a convos timestamp of the last sent message
 * @param {*} timestamp
 * @returns
 */
function ConvosTimestamp({ timestamp }) {
	return (
		<p className="text-lg 2k:text-2xl text-slate-500 pr-2">
			{timestamp?.seconds ? <>{new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(timestamp?.seconds * 1000)} </> : <>{timestamp}</>}
		</p>
	);
}

export default ConvosTimestamp;
