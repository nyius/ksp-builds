import React, { useContext } from 'react';
import NewsContext from '../../../context/news/NewsContext';
import { Editor } from 'react-draft-wysiwyg';

/**
 * Editor for making a challenge
 * @returns
 */
function ChallengeEditor({ parsedArticle }) {
	const { editingChallenge } = useContext(NewsContext);

	if (editingChallenge) {
		return <Editor editorState={parsedArticle} readOnly={true} toolbarHidden={true} />;
	}
}

export default ChallengeEditor;
