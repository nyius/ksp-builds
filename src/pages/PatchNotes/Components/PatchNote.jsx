import React, { useContext } from 'react';
import NewsContext from '../../../context/news/NewsContext';
import { Editor } from 'react-draft-wysiwyg';
import { convertFromRaw, EditorState } from 'draft-js';

/**
 * Displays the patch note
 * @param {obj} patchNote - dispalys the patch note
 * @returns
 */
function PatchNote({ patchNote }) {
	const { editingPatchNotes } = useContext(NewsContext);

	if (editingPatchNotes !== patchNote.id) {
		return <Editor editorState={EditorState.createWithContent(convertFromRaw(JSON.parse(patchNote.patchNote)))} readOnly={true} toolbarHidden={true} />;
	}
}

export default PatchNote;
