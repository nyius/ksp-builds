import React, { useContext } from 'react';
import NewsContext from '../../../../context/news/NewsContext';
import Button from '../../../../components/buttons/Button';
import { setDeletePatchNoteId } from '../../../../context/news/NewsActions';

/**
 * Button for deleting a patch note
 * @param {string} id - id of the patch note
 * @returns
 */
function DeletePatchNoteBtn({ id }) {
	const { dispatchNews } = useContext(NewsContext);

	return <Button htmlFor="delete-patch-note-modal" onClick={() => setDeletePatchNoteId(dispatchNews, id)} text="Delete" icon="delete" />;
}

export default DeletePatchNoteBtn;
