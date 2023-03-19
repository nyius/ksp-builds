import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../buttons/Button';
import useAuth from '../../context/auth/AuthActions';
import UsernameLink from '../buttons/UsernameLink';
import draftJsToPlainText from '../../utilities/draftJsToPlainText';
import createMarkup from '../../utilities/createMarkup';
import { convertFromRaw, EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';

function Notification({ i, notif }) {
	const [timestamp, setTimestamp] = useState(null);
	const navigate = useNavigate();
	const { handleDeleteNotification } = useAuth();
	let editorState;

	if (notif.type === 'message' || notif.type === 'welcome') editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(notif.message)));
	if (notif.type === 'reply' || notif.type === 'comment') editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(notif.comment)));

	useEffect(() => {
		if (notif?.timestamp?.seconds) {
			setTimestamp(new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(notif.timestamp.seconds * 1000));
		}
	}, []);

	/**
	 * handles navigating to a notification
	 */
	const handleNavigate = e => {
		if (e.target.id !== 'userlink') {
			if (notif.type === 'comment') {
				navigate(`/build/${notif.buildId}`);
			}
			if (notif.type === 'newBuild') {
				navigate(`/build/${notif.buildId}`);
			}
			if (notif.type === 'reply') {
				navigate(`/build/${notif.buildId}#${notif.commentId}`);
			}
		}
	};

	//---------------------------------------------------------------------------------------------------//
	return (
		<div onClick={handleNavigate} className={`flex flex-col p-4 2k:p-6 rounded-xl border-2 border-solid border-slate-700 cursor-pointer relative hover:bg-slate-800`}>
			<Button onClick={() => handleDeleteNotification(i, notif.id)} id="deleteBtn" text="x" size="absolute right-0 bottom-0 z-50 " color="text-white" />

			<div className="flex flex-row flex-wrap place-content-between mb-2 2k:mb-4">
				<UsernameLink username={notif.username} uid={notif.uid} />
				<p className="italic text-lg 2k:text-xl text-slate-400">{timestamp}</p>
			</div>
			{notif.type === 'comment' && (
				<>
					<p className="text-lg 2k:text-2xl text-slate-400 italic 2k:mb-3">Someone commented on one of your builds</p>
					<Editor editorState={editorState} readOnly={true} toolbarHidden={true} />
				</>
			)}
			{notif.type === 'reply' && (
				<>
					<p className="text-lg 2k:text-2xl text-slate-400 italic 2k:mb-3">Someone replied to one of your comments</p>
					<Editor editorState={editorState} readOnly={true} toolbarHidden={true} />
				</>
			)}
			{notif.type === 'welcome' && (
				<div className="text-xl 2k:text-2xl">
					<>
						<p className="text-lg 2k:text-2xl text-slate-400 italic 2k:mb-3">Welcome!</p>
						<Editor editorState={editorState} readOnly={true} toolbarHidden={true} />
					</>
				</div>
			)}
			{notif.type === 'message' && (
				<div className="text-xl 2k:text-2xl">
					<>
						<p className="text-lg 2k:text-2xl text-slate-400 italic 2k:mb-3">You have a new message</p>
						<Editor editorState={editorState} readOnly={true} toolbarHidden={true} />
					</>
				</div>
			)}
			{notif.type === 'newBuild' && (
				<div className="text-xl 2k:text-2xl">
					<>
						<p className="text-lg 2k:text-2xl text-slate-400 italic 2k:mb-3">{notif.username} uploaded a new craft! Check it out</p>
						<div className="flex flex-row gap-2 2k:gap-4 items-center">
							<img src={notif.thumbnail} className="h-44 border-solid border-2 border-slate-800" alt="" />
							<p className="text-xl 2k:text-3xl multi-line-truncate">{notif.buildName} </p>
						</div>
					</>
				</div>
			)}
		</div>
	);
}

export default Notification;
