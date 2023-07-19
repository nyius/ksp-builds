import React from 'react';
import { createDateFromFirebaseTimestamp } from '../../../utilities/createDateFromFirebaseTimestamp';

/**
 * Displays the date the user joined
 * @param {timestamp} timestamp - takes in a firestore timestamp ({seconds, nanoseconds})
 * @returns
 */
function UserJoined({ timestamp }) {
	return <p className="text-xl 2k:text-2xl text-slate-400 italic">joined {createDateFromFirebaseTimestamp(timestamp.seconds)}</p>;
}

export default UserJoined;
