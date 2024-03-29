import React, { useEffect, useState } from 'react';
import { useBuildContext } from '../../context/build/BuildContext';
import { convertFromRaw, convertToRaw, EditorState, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { setResetTextEditorState } from '../../context/build/BuildActions';
import { useAuthContext } from '../../context/auth/AuthContext';
import checkIfJson from '../../utilities/checkIfJson';

/**
 * Takes in a setState to set when the text is edited. Also takes in a size that specifies how many toolbar icons are shown. (sm, md, lg). default is lg
 * @param {setter} setState - the state to update with the entered text
 * @param {int} i Takes in an 'i' num if this is used inside of a map, so we know which element to edit
 * @param {string} text
 * @param {string} characterLimit - default 1000
 * @returns
 */
const TextEditor = state => {
	// Handles sending the markup back to the parent
	const { setState, i, text, characterLimit = 1000 } = state;
	const { dispatchBuild, editingBuild, editingComment, resetTextEditor, buildOfTheWeek } = useBuildContext();
	const { editingBio } = useAuthContext();
	const emptyState = `{"blocks":[{"key":"87rfs","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}`;

	const [editorState, setEditorState] = useState(() => {
		if (editingBuild) {
			return EditorState.createWithContent(convertFromRaw(JSON.parse(editingBuild.description)));
		}
		if (editingComment) {
			return EditorState.createWithContent(convertFromRaw(JSON.parse(editingComment.comment)));
		}
		if (buildOfTheWeek) {
			return EditorState.createWithContent(
				ContentState.createFromText(`Congratulations ${buildOfTheWeek.author}! Your build '${buildOfTheWeek.name}' has been chosen as the Build of the Week on our website! We were blown away by your creation and impressed by its design & creativity. As a reward for being selected as the Build of the Week, your creation will be featured prominently on our website's "Builds of the Week" page, and a special badge to display on your profile & build to recognize your achievement. We want to thank you for sharing your amazing creation with us and the KSP community. Keep up the fantastic work, and we can't wait to see what you'll build next! Congratulations once again! ~nyius :)
			`)
			);
		}
		if (editingBio) {
			if (checkIfJson(editingBio.bio)) {
				return EditorState.createWithContent(convertFromRaw(JSON.parse(editingBio.bio)));
			} else {
				return EditorState.createWithContent(ContentState.createFromText(editingBio.bio));
			}
		}
		if (text) {
			if (checkIfJson(text)) {
				return EditorState.createWithContent(convertFromRaw(JSON.parse(text)));
			} else {
				return EditorState.createWithContent(ContentState.createFromText(text));
			}
		}
		return EditorState.createWithContent(convertFromRaw(JSON.parse(emptyState)));
	});

	// Handles the user typing
	const handleEditorChange = state => {
		const contentState = state.getCurrentContent();
		const currentText = contentState.getPlainText();

		if (currentText?.length <= characterLimit) {
			setEditorState(state);
			convertContentToJson();
		}
	};

	// Reser the text editor
	useEffect(() => {
		if (resetTextEditor) {
			setEditorState(EditorState.createWithContent(convertFromRaw(JSON.parse(emptyState))));
			setResetTextEditorState(dispatchBuild, false);
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
		<div className="flex flex-col gap-3">
			<Editor wrapperClassName="text-editor" editorClassName="editor-text-area" toolbarClassName="editor-toolbar" editorState={editorState} onEditorStateChange={handleEditorChange} toolbar={{}} />
			<div className="text-xl 2k:text-2xl">
				<span className={`${editorState?.getCurrentContent()?.getPlainText()?.length >= characterLimit ? 'text-error' : ''}`}>{editorState?.getCurrentContent()?.getPlainText()?.length}</span> / {characterLimit}
			</div>
		</div>
	);
};

export default TextEditor;
