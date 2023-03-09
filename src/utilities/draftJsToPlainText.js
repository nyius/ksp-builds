import { convertFromRaw, EditorState } from 'draft-js';

/**
 * Takes in DraftJS content and converts it to just plaintext (no formatting or anything)
 * @param {*} draftjsContent
 * @returns
 */
const draftJsToPlainText = draftjsContent => {
	const editorText = EditorState.createWithContent(convertFromRaw(JSON.parse(draftjsContent)));
	return editorText.getCurrentContent().getPlainText('\u0001');
};

export default draftJsToPlainText;
