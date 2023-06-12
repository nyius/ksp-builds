import React, { useContext } from 'react';
import NewsContext from '../../../../context/news/NewsContext';
import Button from '../../../../components/buttons/Button';
import { setEditingPatchNotes } from '../../../../context/news/NewsActions';

/**
 * Button to edit a patch note
 * @param {string} id - id of the patch note to edit
 * @returns
 */
function EditPatchNoteBtn({ id }) {
	const { dispatchNews, editingPatchNotes } = useContext(NewsContext);

	if (editingPatchNotes !== id) {
		return <Button text="Edit" icon="edit" onClick={() => setEditingPatchNotes(dispatchNews, id)} />;
	}
}

export default EditPatchNoteBtn;
