import React from 'react';
import { useComment, setDeletingComment } from '../../context/build/BuildActions';
import { useBuildContext } from '../../context/build/BuildContext';
import Button from '../buttons/Button';
import PlanetHeader from '../header/PlanetHeader';

/**
 * Modal for deleting a comment
 * @returns
 */
function DeleteCommentModal() {
	const { deletingCommentId, dispatchBuild, loadedBuild } = useBuildContext();
	const { deleteComment } = useComment();

	//---------------------------------------------------------------------------------------------------//
	return (
		<>
			{loadedBuild && deletingCommentId ? (
				<>
					<input type="checkbox" id="delete-comment-modal" checked={deletingCommentId} className="modal-toggle" />
					<div className="modal">
						<div className="modal-box relative">
							<Button htmlFor="delete-comment-modal" style="btn-circle" position="z-50 absolute right-2 top-2" text="X" onClick={() => setDeletingComment(dispatchBuild, null)} />
							<PlanetHeader text="Delete Comment"></PlanetHeader>
							<h4 className="text-xl 2k:text-3xl text-slate-100 text-center mb-10 2k:mb-16">Are you sure you want to delete this comment?</h4>
							<div className="flex flex-row items-center justify-center gap-4 2k:gap-10">
								<Button htmlFor="delete-comment-modal" color="btn-success" text="Cancel" icon="cancel" onClick={() => setDeletingComment(dispatchBuild, null)} />
								<Button htmlFor="delete-comment-modal" color="btn-error" onClick={() => deleteComment(deletingCommentId)} text="Delete" icon="delete" />
							</div>
						</div>
					</div>
				</>
			) : null}
		</>
	);
}

export default DeleteCommentModal;
