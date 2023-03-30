import React, { useEffect, useState, useContext } from 'react';
import BuildContext from '../../context/build/BuildContext';
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import useBuild from '../../context/build/BuildActions';

/**
 * Takes in a setState to set when the text is edited. Also takes in a size that specifies how many toolbar icons are shown. (sm, md, lg). default is lg
 * @param {*} state
 * @param {*} size sm, md, lg
 * @param {number} i Takes in an 'i' num if this is used inside of a map, so we know which element to edit
 * @returns
 */
const TextEditor = state => {
	// Handles sending the markup back to the parent
	const { setState, size, i, reset, text } = state;
	const { editingBuild, editingComment, resetTextEditor } = useContext(BuildContext);
	const { setResetTextEditorState } = useBuild();
	const emptyState = `{"blocks":[{"key":"87rfs","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}`;

	const [editorState, setEditorState] = useState(() => {
		if (editingBuild) {
			return EditorState.createWithContent(convertFromRaw(JSON.parse(editingBuild.description)));
		}
		if (editingComment) {
			return EditorState.createWithContent(convertFromRaw(JSON.parse(editingComment.comment)));
		}
		if (text) {
			return EditorState.createWithContent(convertFromRaw(JSON.parse(text)));
		}
		return EditorState.createWithContent(convertFromRaw(JSON.parse(emptyState)));
	});

	// Handles the user typing
	const handleEditorChange = state => {
		setEditorState(state);
		convertContentToJson();
	};

	useEffect(() => {
		if (resetTextEditor) {
			setEditorState(EditorState.createWithContent(convertFromRaw(JSON.parse(emptyState))));
			setResetTextEditorState(false);
		}
	}, [resetTextEditor]);

	// Takes the editor content and converts it to JSON (to store on the DB)
	const convertContentToJson = () => {
		let currentContentAsJson = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
		if (i >= 0) {
			setState(prevState => {
				prevState[i] = currentContentAsJson;
				return prevState;
			});
		} else {
			setState(currentContentAsJson);
		}
	};

	//---------------------------------------------------------------------------------------------------//
	return (
		<>
			<Editor wrapperClassName="text-editor" editorClassName="editor-text-area" toolbarClassName="editor-toolbar" editorState={editorState} onEditorStateChange={handleEditorChange} toolbar={{}} />
		</>
	);
};

export default TextEditor;
