import React from 'react';
import { useBuildContext } from '../../../context/build/BuildContext';
import TextEditor from '../../textEditor/TextEditor';
import { Editor } from 'react-draft-wysiwyg';
import { convertFromRaw, EditorState } from 'draft-js';

/**
 * Displays the comments body and editor (if editing a comment)
 * @param {obj} comment - the whole comment obj
 * @param {state setter} setEditedComment - state setter when editing a comment
 * @returns
 */
function CommentBody({ comment, setEditedComment }) {
	const { editingComment } = useBuildContext();
	const editorState = comment.comment !== 'deleted' && EditorState.createWithContent(convertFromRaw(JSON.parse(comment.comment)));

	//---------------------------------------------------------------------------------------------------//
	if (editingComment.id === comment.id) {
		return <TextEditor setState={setEditedComment} />;
	} else {
		if (comment.comment === 'deleted') {
			return <span className="italic">Comment Deleted</span>;
		} else {
			return <Editor editorState={editorState} readOnly={true} toolbarHidden={true} />;
		}
	}
}

export default CommentBody;
