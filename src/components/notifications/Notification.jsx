import React from 'react';
import { useNavigate } from 'react-router-dom';
import UsernameLink from '../username/UsernameLink';
import { convertFromRaw, EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import NotifTimestamp from './Components/NotifTimestamp';
import DeleteNotifBtn from './Buttons/DeleteNotifBtn';
import NotifBuildImage from './Components/NotifBuildImage';

/**
 * Displays a notification
 * @param {*} i
 * @param {obj} notif - the notif to display
 * @returns
 */
function Notification({ i, notif }) {
	const navigate = useNavigate();
	let editorState;

	if (notif.type === 'message' || notif.type === 'welcome' || notif.type === 'update' || notif.type === 'buildOfTheWeek') editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(notif.message)));
	if (notif.type === 'reply' || notif.type === 'comment') editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(notif.comment)));

	/**
	 * handles navigating to a notification
	 */
	const handleNavigate = e => {
		if (e.target.id !== 'userlink') {
			if (notif.type === 'comment') {
				navigate(`/build/${notif.buildId}#${notif.commentId}`);
			}
			if (notif.type === 'newBuild' || notif.type === 'buildOfTheWeek') {
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
			<DeleteNotifBtn i={i} id={notif.id} />
			<div className="flex flex-row flex-wrap place-content-between mb-2 2k:mb-4">
				<UsernameLink hoverPosition="bottom-right" username={notif.username} uid={notif.uid} />
				<NotifTimestamp timestamp={notif?.timestamp} />
			</div>
			<p className="text-lg 2k:text-2xl text-slate-400 italic 2k:mb-3">
				{notif.type === 'reply' && `Someone replied to one of your comments`}
				{notif.type === 'welcome' && 'Welcome!'}
				{notif.type === 'message' && 'You have a new message'}
				{notif.type === 'comment' && 'Someone commented on one of your builds!'}
				{notif.type === 'update' && 'KSP Builds update!'}
				{notif.type === 'challenge' && 'New challenge!'}
				{notif.type === 'buildOfTheWeek' && "Congratulations, you're the Build of the Week Winner!"}
				{notif.type === 'newBuild' && <>{notif.username} uploaded a new craft! Check it out</>}
			</p>
			<NotifBuildImage notif={notif} />
			<Editor editorState={editorState} readOnly={true} toolbarHidden={true} />
		</div>
	);
}

export default Notification;
