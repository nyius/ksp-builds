import React from 'react';
import { useBuildContext } from '../../../context/build/BuildContext';
import { setEditingComment } from '../../../context/build/BuildActions';

/**
 * Displays the edit comment button
 * @param {*} comment - the comment to edit
 * @returns
 */
function CommentEditBtn({ comment }) {
	const { dispatchBuild, editingComment } = useBuildContext();

	//---------------------------------------------------------------------------------------------------//
	if (!editingComment && comment.comment !== 'deleted') {
		return (
			<p onClick={() => setEditingComment(dispatchBuild, comment)} className="text-slate-400 hover:text-blue-300 cursor-pointer 2k:text-2xl">
				Edit
			</p>
		);
	}
}

export default CommentEditBtn;
