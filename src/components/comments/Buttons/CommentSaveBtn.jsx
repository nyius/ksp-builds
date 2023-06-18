import React, { useContext } from 'react';
import BuildContext from '../../../context/build/BuildContext';
import { setEditingComment } from '../../../context/build/BuildActions';
import { updateComment } from '../../../context/build/BuildUtils';
import useBuild from '../../../context/build/BuildActions';

/**
 * Allows the user to save an edited comment.
 * @param {*} commentId - the id of the comment to save
 * @param {*} editedComment - the new comment
 * @param {state setter} setEditedComment - the state setter to reset edting a comment
 * @returns
 */
function CommentSaveBtn({ commentId, editedComment, setEditedComment }) {
	const { dispatchBuild, editingComment, loadedBuild } = useContext(BuildContext);
	const { fetchComments } = useBuild();

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
			<p className="text-slate-500 hover:text-green-300 cursor-pointer 2k:text-2xl" onClick={e => handleSaveCommentEdit(e)}>
				Save
			</p>
		);
	}
}

export default CommentSaveBtn;
