import React, { useContext } from 'react';
import { setDeletingComment } from '../../../context/build/BuildActions';
import BuildContext from '../../../context/build/BuildContext';

/**
 * Displays the delete comment button
 * @param {*} comment
 * @returns
 */
function CommentDeleteBtn({ comment }) {
	const { dispatchBuild } = useContext(BuildContext);

	//---------------------------------------------------------------------------------------------------//
	if (comment.comment !== 'deleted') {
		return (
			<p onClick={() => setDeletingComment(dispatchBuild, comment.id)} htmlFor="delete-comment-modal" className="text-slate-500 hover:text-red-300 cursor-pointer 2k:text-2xl">
				Delete
			</p>
		);
	}
}

export default CommentDeleteBtn;
