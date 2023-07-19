import React from 'react';
import { useBuildContext } from '../../../context/build/BuildContext';
import { setEditingComment, useFetchComments } from '../../../context/build/BuildActions';
import { updateComment } from '../../../context/build/BuildUtils';

/**
 * Allows the user to save an edited comment.
 * @param {*} commentId - the id of the comment to save
 * @param {*} editedComment - the new comment
 * @param {state setter} setEditedComment - the state setter to reset edting a comment
 * @returns
 */
function CommentSaveBtn({ commentId, editedComment, setEditedComment }) {
	const { dispatchBuild, editingComment, loadedBuild } = useBuildContext();
	const { fetchComments } = useFetchComments();

	/**
	 * Handles when a user saves changes to their comment
	 * @param {*} e
	 */
	const handleSaveCommentEdit = async e => {
		await updateComment(editedComment, commentId, loadedBuild.id);
		setEditedComment(false);
		setEditingComment(dispatchBuild, false);
		await fetchComments(loadedBuild.id);
	};

	//---------------------------------------------------------------------------------------------------//
	if (editingComment && editingComment.id === commentId) {
		return (
			<p className="text-slate-300 hover:text-green-400 cursor-pointer 2k:text-2xl" onClick={e => handleSaveCommentEdit(e)}>
				Save
			</p>
		);
	}
}

export default CommentSaveBtn;
