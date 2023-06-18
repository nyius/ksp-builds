import React from 'react';

/**
 * Displays timestamp if a comment was edited
 * @param {*} comment
 * @returns
 */
function CommentEdited({ comment }) {
	if (comment.edited) {
		return <div className="2k:text-2xl italic">edited {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(comment.edited.seconds * 1000)}</div>;
	}
}

export default CommentEdited;
