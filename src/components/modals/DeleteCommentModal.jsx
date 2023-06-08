import React, { useContext } from 'react';
import { useComment, setDeletingComment } from '../../context/build/BuildActions';
import BuildContext from '../../context/build/BuildContext';
import Button from '../buttons/Button';

function DeleteCommentModal() {
	const { deletingCommentId, dispatchBuild } = useContext(BuildContext);
	const { deleteComment } = useComment();

	//---------------------------------------------------------------------------------------------------//
	return (
		<>
			<input type="checkbox" id="delete-comment-modal" checked={deletingCommentId ? true : false} className="modal-toggle" />
			<div className="modal">
				<div className="modal-box relative">
					<Button htmlFor="delete-comment-modal" style="btn-circle" position="absolute right-2 top-2" text="X" onClick={() => setDeletingComment(dispatchBuild, null)} />
					<h3 className="text-lg 2k:text-3xl font-bold text-center 2k:mb-6">Delete Comment</h3>
					<h4 className="text-lg 2k:text-3xl text-center mb-4 2k:mb-16">Are you sure you want to delete this comment?</h4>
					<div className="flex flex-row items-center justify-center gap-4 2k:gap-10">
						<Button htmlFor="delete-comment-modal" color="btn-success" text="Cancel" icon="cancel" onClick={() => setDeletingComment(dispatchBuild, null)} />
						<Button htmlFor="delete-comment-modal" color="btn-error" onClick={() => deleteComment(deletingCommentId)} text="Delete" icon="delete" />
					</div>
				</div>
			</div>
		</>
	);
}

export default DeleteCommentModal;
