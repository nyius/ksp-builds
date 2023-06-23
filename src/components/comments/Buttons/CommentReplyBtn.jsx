import React, { useContext } from 'react';
import AuthContext from '../../../context/auth/AuthContext';
import CheckCredentials from '../../credentials/CheckCredentials';
import BuildContext from '../../../context/build/BuildContext';
import { setReplyingComment } from '../../../context/build/BuildActions';

/**
 * Button to reply to a user
 * @param {obj} comment - the comment to reply to
 * @returns
 */
function CommentReplyBtn({ comment }) {
	const { editingComment, dispatchBuild } = useContext(BuildContext);
	const { fetchedUserProfile, user } = useContext(AuthContext);

	//---------------------------------------------------------------------------------------------------//
	if (!editingComment && !fetchedUserProfile?.blockList?.includes(user.uid) && comment.comment !== 'deleted') {
		return (
			<CheckCredentials type="user">
				<a href={`#add-comment`} onClick={() => setReplyingComment(dispatchBuild, comment)} className="text-slate-400 hover:text-blue-300 cursor-pointer 2k:text-2xl">
					Reply
				</a>
			</CheckCredentials>
		);
	}
}

export default CommentReplyBtn;
