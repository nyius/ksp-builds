import { convertFromRaw, EditorState } from 'draft-js';

const draftJsToPlainText = draftjsContent => {
	const editorText = EditorState.createWithContent(convertFromRaw(JSON.parse(draftjsContent)));
	return editorText.getCurrentContent().getPlainText('\u0001');
};

export default draftJsToPlainText;
