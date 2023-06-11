import React, { useContext } from 'react';
import NewsContext from '../../context/news/NewsContext';
import Button from '../buttons/Button';
import { deleteDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db } from '../../firebase.config';
import { setDeletePatchNoteId } from '../../context/news/NewsActions';

/**
 * Modal for deleting a patch note
 * @returns
 */
function DeletePatchNotesModal() {
	const { dispatchNews, deletePatchNoteId } = useContext(NewsContext);

	/**
	 * handles deleting a post
	 */
	const deletePatchNote = async () => {
		try {
			await deleteDoc(doc(db, 'patchNotes', deletePatchNoteId));
			setDeletePatchNoteId(dispatchNews, null);
			toast.success('Patch note deleted');
		} catch (error) {
			console.log(error);
			toast.error('Something went wrong deleting post');
		}
	};

	//---------------------------------------------------------------------------------------------------//
	if (deletePatchNoteId) {
		return (
			<>
				<input type="checkbox" id="delete-patch-note-modal" className="modal-toggle" />
				<div className="modal">
					<div className="modal-box relative">
						<Button htmlFor="delete-patch-note-modal" style="btn-circle" position="absolute right-2 top-2" text="X" onClick={() => setDeletePatchNoteId(dispatchNews, null)} />
						<h3 className="text-lg 2k:text-3xl font-bold text-center 2k:mb-6">Delete patch Note</h3>
						<h4 className="text-lg 2k:text-3xl text-center mb-4 2k:mb-16">Are you sure you want to delete this patch note?</h4>
						<div className="flex flex-row items-center justify-center gap-4 2k:gap-10">
							<Button htmlFor="delete-patch-note-modal" color="btn-success" text="Cancel" icon="cancel" onClick={() => setDeletePatchNoteId(dispatchNews, null)} />
							<Button htmlFor="delete-patch-note-modal" color="btn-error" onClick={deletePatchNote} text="Delete" icon="delete" />
						</div>
					</div>
				</div>
			</>
		);
	}
}

export default DeletePatchNotesModal;
