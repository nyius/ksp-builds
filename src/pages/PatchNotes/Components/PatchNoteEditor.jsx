import React, { useContext } from 'react';
import NewsContext from '../../../context/news/NewsContext';
import TextEditor from '../../../components/textEditor/TextEditor';

/**
 * Editor for editing patch note
 * @param {obj} patchNote - the patch note to be edited
 * @param {setter} setEditedPatchNote - the state updater for the edited patch note
 * @returns
 */
function PatchNoteEditor({ patchNote, setEditedPatchNote }) {
	const { editingPatchNotes } = useContext(NewsContext);

	if (patchNote.id === editingPatchNotes) {
		return <TextEditor text={patchNote.patchNote} setState={setEditedPatchNote} />;
	}
}

export default PatchNoteEditor;
