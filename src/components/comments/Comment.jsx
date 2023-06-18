import React, { useState } from 'react';
//---------------------------------------------------------------------------------------------------//
import CheckCredentials from '../credentials/CheckCredentials';
import UsernameLink from '../username/UsernameLink';
import CommentDate from './Components/CommentDate';
import CommentBody from './Components/CommentBody';
import CommentReplyBtn from './Buttons/CommentReplyBtn';
import CommentSaveBtn from './Buttons/CommentSaveBtn';
import CommentEditBtn from './Buttons/CommentEditBtn';
import CommentDeleteBtn from './Buttons/CommentDeleteBtn';
import CommentReportBtn from './Buttons/CommentReportBtn';
import CommentEdited from './Components/CommentEdited';
import CommentReplyBox from './Components/CommentReplyBox';

/**
 * Handles displaying a comment
 * @param {obj} comment
 * @returns
 */
function Comment({ comment }) {
	const [editedComment, setEditedComment] = useState('');

	//---------------------------------------------------------------------------------------------------//
	return (
		<div>
			<CommentReplyBox comment={comment} />

			<div id={comment.id} className="flex flex-col gap-4 2k:gap-8 w-full bg-base-100 rounded-b-md p-4 2k:p-8  ">
				<div className="flex flex-row w-full gap-4 place-content-between">
					<UsernameLink username={comment.username} uid={comment.uid} hoverPosition="right" css="font-bold" />
					<CommentDate timestamp={comment.timestamp} />
				</div>
				<CommentBody comment={comment} setEditedComment={setEditedComment} />

				<div className="flex flex-row gap-4 2k:gap-8">
					<CommentReplyBtn comment={comment} />
					<CheckCredentials type="commentOwner" uid={comment.uid}>
						<CommentSaveBtn commentId={comment.id} editedComment={editedComment} setEditedComment={setEditedComment} />
						<CommentEditBtn comment={comment} />
						<CommentDeleteBtn comment={comment} />
					</CheckCredentials>
					<CommentReportBtn comment={comment} />
					<CommentEdited comment={comment} />
				</div>
			</div>
		</div>
	);
}

export default Comment;
