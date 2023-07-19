import React from 'react';
import { useNewsContext } from '../../../context/news/NewsContext';
import { Editor } from 'react-draft-wysiwyg';

/**
 * Editor for making a challenge
 * @returns
 */
function ChallengeEditor({ parsedArticle }) {
	const { editingChallenge } = useNewsContext();

	if (editingChallenge) {
		return <Editor editorState={parsedArticle} readOnly={true} toolbarHidden={true} />;
	}
}

export default ChallengeEditor;
