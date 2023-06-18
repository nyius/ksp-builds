import React from 'react';

/**
 * Displays the date the user joined
 * @param {timestamp} timestamp - takes in a firestore timestamp ({seconds, nanoseconds})
 * @returns
 */
function UserJoined({ timestamp }) {
	return <p className="text-xl 2k:text-2xl text-slate-400 italic">joined {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(timestamp.seconds * 1000)}</p>;
}

export default UserJoined;
