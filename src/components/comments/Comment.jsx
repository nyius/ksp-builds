import React, { useContext, useState } from 'react';
//---------------------------------------------------------------------------------------------------//
import AuthContext from '../../context/auth/AuthContext';
import useBuild, { setReplyingComment, setEditingComment, useComment } from '../../context/build/BuildActions';
import { updateComment } from '../../context/build/BuildUtils';
import BuildContext from '../../context/build/BuildContext';
import { setReport } from '../../context/auth/AuthActions';
//---------------------------------------------------------------------------------------------------//
import { convertFromRaw, EditorState } from 'draft-js';
import TextEditor from '../textEditor/TextEditor';
import { Editor } from 'react-draft-wysiwyg';
import { FaReply } from 'react-icons/fa';
//---------------------------------------------------------------------------------------------------//
import UsernameLink from '../buttons/UsernameLink';

/**
 * Handles displaying a comment
 * @param {obj} comment
 * @returns
 */
function Comment({ comment }) {
	const { dispatchBuild, loadedBuild, editingComment } = useContext(BuildContext);
	const { dispatchAuth, user, authLoading, fetchedUserProfile } = useContext(AuthContext);
	//---------------------------------------------------------------------------------------------------//
	const [editedComment, setEditedComment] = useState('');
	//---------------------------------------------------------------------------------------------------//
	const { fetchComments } = useBuild();
	const { deleteComment } = useComment();

	const date = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(comment.timestamp.seconds * 1000);
	const editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(comment.comment)));

	/**
	 * Handles when a user saves changes to their comment
	 * @param {*} e
	 */
	const handleSaveCommentEdit = async e => {
		await updateComment(editedComment, comment.id, loadedBuild.id);
		setEditedComment(false);
		setEditingComment(dispatchBuild, false);
		await fetchComments(loadedBuild.id);
	};

	/**
	 * Handles setting the reported comment
	 */
	const handleSetReport = () => {
		setReport(dispatchAuth, 'comment', comment);
	};

	//---------------------------------------------------------------------------------------------------//
	return (
		<div>
			{/* If comment reply */}
			{comment.replyCommentUsername && (
				<a href={`#${comment.replyCommentId}`} className="w-full flex flex-col rounded-t-lg gap-3 2k:gap-6 p-2 2k:p-4 bg-base-600">
					<div className="flex flex-row gap-3 2k:gap-6 items-center ">
						<div className="text-lg 2k:text-xl">
							<FaReply />
						</div>
						<p className="italic text-slate-400 text-lg 2k:text-xl">
							Replying to {comment.replyCommentUsername}'s comment at{' '}
							{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(comment.replyTimestamp.seconds * 1000)}
						</p>
					</div>
					{comment.replyComment && <p className="italic text-slate-400 text-lg 2k:text-xl bg-base-300 p-3 2k:p-6 ">{comment.replyComment}...</p>}
				</a>
			)}

			{/* Comment Body */}
			<div id={comment.id} className="flex flex-col gap-4 2k:gap-8 w-full bg-base-100 rounded-b-md p-4 2k:p-8  ">
				<div className="flex flex-row w-full gap-4 place-content-between">
					<div className="font-bold text-lg text-slate-300 2k:text-3xl">
						<UsernameLink username={comment.username} uid={comment.uid} hoverPosition={'right'} />
					</div>
					<p className="2k:text-2xl">{date}</p>
				</div>
				<div className="text-white">{editingComment.id === comment.id ? <TextEditor setState={setEditedComment} /> : <Editor editorState={editorState} readOnly={true} toolbarHidden={true} />}</div>
				<div className="flex flex-row gap-4 2k:gap-8">
					{!editingComment && user?.username && (
						<>
							{!fetchedUserProfile?.blockList?.includes(user.uid) && (
								<a href={`#add-comment`} onClick={() => setReplyingComment(dispatchBuild, comment)} className="text-slate-500 hover:text-blue-300 cursor-pointer 2k:text-2xl">
									Reply
								</a>
							)}
						</>
					)}
					{!authLoading && (user?.uid === comment.uid || user?.siteAdmin) && (
						<>
							{editingComment && editingComment.id === comment.id && (
								<p className="text-slate-500 hover:text-green-300 cursor-pointer 2k:text-2xl" onClick={e => handleSaveCommentEdit(e)}>
									Save
								</p>
							)}
							{editingComment && editingComment.id === comment.id && (
								<p onClick={() => setEditingComment(dispatchBuild, false)} className="text-slate-500 hover:text-blue-300 cursor-pointer 2k:text-2xl">
									Cancel
								</p>
							)}
							{!editingComment && (
								<p onClick={() => setEditingComment(dispatchBuild, comment)} className="text-slate-500 hover:text-blue-300 cursor-pointer 2k:text-2xl">
									Edit
								</p>
							)}
							<p onClick={() => deleteComment(comment.id)} className="text-slate-500 hover:text-red-300 cursor-pointer 2k:text-2xl">
								Delete
							</p>
						</>
					)}
					<label htmlFor="report-modal" className="text-slate-500 hover:text-blue-300 cursor-pointer 2k:text-2xl" onClick={handleSetReport}>
						Report
					</label>
				</div>
			</div>
		</div>
	);
}

export default Comment;
