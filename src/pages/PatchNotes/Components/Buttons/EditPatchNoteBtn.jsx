import React from 'react';
import { useNewsContext } from '../../../../context/news/NewsContext';
import Button from '../../../../components/buttons/Button';
import { setEditingPatchNotes } from '../../../../context/news/NewsActions';

/**
 * Button to edit a patch note
 * @param {string} id - id of the patch note to edit
 * @returns
 */
function EditPatchNoteBtn({ id }) {
	const { dispatchNews, editingPatchNotes } = useNewsContext();

	if (editingPatchNotes !== id) {
		return <Button text="Edit" icon="edit" onClick={() => setEditingPatchNotes(dispatchNews, id)} />;
	}
}

export default EditPatchNoteBtn;
