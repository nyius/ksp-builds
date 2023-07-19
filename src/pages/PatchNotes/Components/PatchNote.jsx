import React, { useEffect } from 'react';
import { useNewsContext } from '../../../context/news/NewsContext';
import { Editor } from 'react-draft-wysiwyg';
import useCreateDraftJs from '../../../hooks/useCreateDraftJs';

/**
 * Displays the patch note
 * @param {obj} patchNote - dispalys the patch note
 * @returns
 */
function PatchNote({ patchNote }) {
	const { editingPatchNotes } = useNewsContext();
	const [patchNoteDraftJs] = useCreateDraftJs(null, patchNote.patchNote);

	if (editingPatchNotes !== patchNote.id) {
		return <Editor editorState={patchNoteDraftJs} readOnly={true} toolbarHidden={true} />;
	}
}

export default PatchNote;
