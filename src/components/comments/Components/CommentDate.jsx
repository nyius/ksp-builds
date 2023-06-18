import React from 'react';

/**
 * Displays the comments date
 * @param {*} timestamp - a firebase timestamp ({seconds, nanoseconds})
 * @returns
 */
function CommentDate({ timestamp }) {
	return <p className="">{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(timestamp.seconds * 1000)}</p>;
}

export default CommentDate;
