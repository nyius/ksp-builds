import React, { useContext, useState } from 'react';
import AuthContext from '../../context/auth/AuthContext';
import useBuild from '../../context/build/BuildActions';
import BuildContext from '../../context/build/BuildContext';
import UsernameLink from '../buttons/UsernameLink';
import TextEditor from '../textEditor/TextEditor';
import { convertFromRaw, EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';

/**
 * Handles displaying a comment
 * @param {*} comment
 * @returns
 */
function Comment({ comment }) {
	const { user, authLoading } = useContext(AuthContext);
	const { loadedBuild, editingComment } = useContext(BuildContext);
	const [editedComment, setEditedComment] = useState('');
	const { deleteComment, updateComment, fetchComments, setEditingComment, setReplyingComment } = useBuild();
	const date = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(comment.timestamp.seconds * 1000);
	const editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(comment.comment)));

	/**
	 * Handles when a user saves changes to their comment
	 * @param {*} e
	 */
	const handleSaveCommentEdit = async e => {
		await updateComment(editedComment, comment.id);
		setEditedComment(false);
		setEditingComment(false);
		await fetchComments(loadedBuild.id);
	};

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className="flex flex-col gap-4 2k:gap-8 w-full bg-base-500 rounded-xl p-4">
			<div className="flex flex-row w-full gap-4 place-content-between">
				<div className="font-bold text-lg text-slate-300 2k:text-3xl">
					<UsernameLink username={comment.username} uid={comment.uid} />
				</div>
				<p className="2k:text-2xl">{date}</p>
			</div>
			{editingComment ? <TextEditor setState={setEditedComment} /> : <Editor editorState={editorState} readOnly={true} toolbarHidden={true} />}

			{!authLoading && (user?.uid === comment.uid || user?.siteAdmin) && (
				<div className="flex flex-row gap-4 2k:gap-8">
					{editingComment && (
						<p className="text-slate-500 hover:text-green-300 cursor-pointer 2k:text-3xl" onClick={e => handleSaveCommentEdit(e)}>
							Save
						</p>
					)}
					{editingComment && (
						<p onClick={() => setEditingComment(false)} className="text-slate-500 hover:text-blue-300 cursor-pointer 2k:text-3xl">
							Cancel
						</p>
					)}
					{!editingComment && (
						<p onClick={() => setEditingComment(comment)} className="text-slate-500 hover:text-blue-300 cursor-pointer 2k:text-3xl">
							Edit
						</p>
					)}
					{!editingComment && (
						<p onClick={() => setReplyingComment(comment)} className="text-slate-500 hover:text-blue-300 cursor-pointer 2k:text-3xl">
							Reply
						</p>
					)}
					<p onClick={() => deleteComment(comment.id)} className="text-slate-500 hover:text-red-300 cursor-pointer 2k:text-3xl">
						Delete
					</p>
				</div>
			)}
		</div>
	);
}

export default Comment;
