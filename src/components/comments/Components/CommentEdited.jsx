import React from 'react';
import { createDateFromFirebaseTimestamp } from '../../../utilities/createDateFromFirebaseTimestamp';

/**
 * Displays timestamp if a comment was edited
 * @param {*} comment
 * @returns
 */
function CommentEdited({ comment }) {
	if (comment.edited) {
		return <div className="2k:text-2xl italic">edited {createDateFromFirebaseTimestamp(comment.edited.seconds, 'long')}</div>;
	}
}

export default CommentEdited;
