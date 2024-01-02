import React, { useEffect, useState } from 'react';
import Parser from 'html-react-parser';
import { Editor } from 'react-draft-wysiwyg';
import { useGetBuildDesc } from '../../../context/build/BuildActions';
import { EditorState, convertFromRaw } from 'draft-js';

/**
 * Displays a articles description
 * @param {*} article - the raw article
 * @returns
 */
function ArticleDescription({ article }) {
	const [articleDesc, setArticleDesc] = useState(null);

	useEffect(() => {
		setArticleDesc(EditorState.createWithContent(convertFromRaw(JSON.parse(article))));
	}, []);

	//---------------------------------------------------------------------------------------------------//
	return (
		<>
			<div className="mb-20 2k:mb-32 text-xl 2k:text-3xl text-slate-200">
				<Editor editorState={articleDesc} readOnly={true} toolbarHidden={true} />
			</div>
		</>
	);
}

export default ArticleDescription;
