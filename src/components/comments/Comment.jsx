import React, { useContext, useState } from 'react';
import AuthContext from '../../context/auth/AuthContext';
import useBuild from '../../context/build/BuildActions';
import BuildContext from '../../context/build/BuildContext';

function Comment({ comment }) {
	const { user, authLoading } = useContext(AuthContext);
	const { loadedBuild } = useContext(BuildContext);
	const [editingComment, setEditingComment] = useState(false);
	const [editedComment, setEditedComment] = useState('');
	const { deleteComment, updateComment, fetchComments } = useBuild();
	const date = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(comment.timestamp.seconds * 1000);

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
				<p className="font-bold text-lg text-slate-300 2k:text-3xl">{comment.username}</p>
				<p className="2k:text-2xl">{date}</p>
			</div>
			{editingComment ? (
				<textarea onChange={e => setEditedComment(e.target.value)} defaultValue={comment.comment} maxLength="3000" name="" id="" placeholder="Leave a comment" rows="4" className="textarea 2k:text-2xl"></textarea>
			) : (
				<p className="text-slate-200 2k:text-3xl">{comment.comment}</p>
			)}

			{!authLoading && (user?.uid === comment.uid || user?.siteAdmin) && (
				<div className="flex flex-row gap-4 2k:gap-8">
					{editingComment && (
						<p className="text-slate-500 hover:text-green-300 cursor-pointer 2k:text-3xl" onClick={e => handleSaveCommentEdit(e)}>
							Save
						</p>
					)}
					<p onClick={() => setEditingComment(!editingComment)} className="text-slate-500 hover:text-blue-300 cursor-pointer 2k:text-3xl">
						{editingComment ? 'Cancel' : 'Edit'}
					</p>
					<p onClick={() => deleteComment(comment.id)} className="text-slate-500 hover:text-red-300 cursor-pointer 2k:text-3xl">
						Delete
					</p>
				</div>
			)}
		</div>
	);
}

export default Comment;
