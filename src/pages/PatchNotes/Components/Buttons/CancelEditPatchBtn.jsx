import React, { useContext } from 'react';
import NewsContext from '../../../../context/news/NewsContext';
import Button from '../../../../components/buttons/Button';
import { setEditingPatchNotes } from '../../../../context/news/NewsActions';

/**
 * Button for cancelling editing a patch note
 * @param {string} id - id of the patch note
 * @returns
 */
function CancelEditPatchBtn({ id }) {
	const { dispatchNews, editingPatchNotes } = useContext(NewsContext);
	if (id === editingPatchNotes) {
		return <Button text="Cancel" color="btn-error" icon="cancel" onClick={() => setEditingPatchNotes(dispatchNews, null)} />;
	}
}

export default CancelEditPatchBtn;
