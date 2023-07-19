import React from 'react';
import CommentDate from './CommentDate';

/**
 * Handles displaying the comments reply time
 * @param {string} username - the username that is being replied to
 * @param {timestamp} timestamp - the date of the replied comment
 * @returns
 */
function CommentReplyDate({ username, timestamp }) {
	return (
		<div className="flex flex-row italic text-slate-400 text-lg 2k:text-xl gap-2">
			Replying to {username}'s comment at{' '}
			<span>
				<CommentDate timestamp={timestamp} />
			</span>
		</div>
	);
}

export default CommentReplyDate;
