import React from 'react';
import { createDateFromFirebaseTimestamp } from '../../../utilities/createDateFromFirebaseTimestamp';

/**
 * Displays a convos timestamp of the last sent message
 * @param {*} timestamp
 * @returns
 */
function ConvosTimestamp({ timestamp }) {
	return <p className="text-lg 2k:text-2xl text-slate-500 pr-2">{timestamp?.seconds ? <>{createDateFromFirebaseTimestamp(timestamp?.seconds, 'long')} </> : <>{timestamp}</>}</p>;
}

export default ConvosTimestamp;
