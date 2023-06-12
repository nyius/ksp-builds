import React, { useContext } from 'react';
import NewsContext from '../../../../context/news/NewsContext';
import Button from '../../../../components/buttons/Button';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../../../../firebase.config';
import { toast } from 'react-toastify';
import { setEditingPatchNotes } from '../../../../context/news/NewsActions';

/**
 * Button for saving an edit to a patch note
 * @param {string} id - id for patch note to save
 * @param {string} editedPatchNotes - the updated patch notes to save to the db
 * @returns
 */
function SavePatchEditBtn({ id, editedPatchNotes }) {
	const { dispatchNews, editingPatchNotes } = useContext(NewsContext);

	/**
	 * Handles updates
	 */
	const updatePatchNote = async id => {
		try {
			await updateDoc(doc(db, 'patchNotes', id), { patchNote: editedPatchNotes });
			toast.success('Patch note updated!');

			setEditingPatchNotes(dispatchNews, false);
		} catch (error) {
			console.log(error);
			toast.error('Something went wrong updating those notes');
		}
	};

	if (editingPatchNotes === id) {
		return <Button text="Save" color="btn-primary" icon="save" onClick={() => updatePatchNote(id)} />;
	}
}

export default SavePatchEditBtn;
