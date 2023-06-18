import React from 'react';
import CommentReplyDate from './CommentReplyDate';
import { FaReply } from 'react-icons/fa';

/**
 * Displays the comment reply detail box
 * @param {*} comment
 * @returns
 */
function CommentReplyBox({ comment }) {
	if (comment.replyCommentUsername) {
		return (
			<a href={`#${comment.replyCommentId}`} className="w-full flex flex-col rounded-t-lg gap-3 2k:gap-6 p-2 2k:p-4 bg-base-600">
				<div className="flex flex-row gap-3 2k:gap-6 items-center ">
					<div className="text-lg 2k:text-xl">
						<FaReply />
					</div>
					<CommentReplyDate timestamp={comment.replyTimestamp} username={comment.replyCommentUsername} />
				</div>
				{comment.replyComment ? <p className="italic text-slate-400 text-lg 2k:text-xl bg-base-300 p-3 2k:p-6 ">{comment.replyComment}...</p> : null}
			</a>
		);
	}
}

export default CommentReplyBox;
