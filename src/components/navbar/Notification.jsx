import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../buttons/Button';
import useAuth from '../../context/auth/AuthActions';
import UsernameLink from '../buttons/UsernameLink';
import draftJsToPlainText from '../../utilities/draftJsToPlainText';
import createMarkup from '../../utilities/createMarkup';

function Notification({ i, notif }) {
	const [timestamp, setTimestamp] = useState(null);
	const navigate = useNavigate();
	const { handleDeleteNotification } = useAuth();

	useEffect(() => {
		if (notif.timestamp) {
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
		}
	};

	//---------------------------------------------------------------------------------------------------//
	return (
		<div onClick={handleNavigate} className={`flex flex-col p-4 2k:p-6 rounded-xl border-2 border-solid border-slate-700 cursor-pointer relative hover:bg-slate-800`}>
			<Button onClick={() => handleDeleteNotification(i, notif.id)} id="deleteBtn" icon="delete" style="btn-circle" size="absolute right-0 bottom-0 z-50 btn-sm" color="bg-error text-white" />

			<div className="flex flex-row flex-wrap place-content-between mb-4 2k:mb-8">
				<UsernameLink username={notif.username} uid={notif.uid} />
				<p className="italic text-lg 2k:text-xl text-slate-400">{timestamp}</p>
			</div>
			{notif.type === 'comment' && (
				<>
					<p className="text-lg 2k:text-2xl text-slate-500 italic 2k:mb-3">Someone commented on one of your builds</p>
					<p className="text-xl 2k:text-3xl multi-line-truncate">{draftJsToPlainText(notif.comment)}</p>
				</>
			)}
			{notif.type === 'welcome' && (
				<p className="text-xl 2k:text-2xl">
					<>
						<p className="text-lg 2k:text-2xl text-slate-500 italic 2k:mb-3">Welcome!</p>
						<p className="text-xl 2k:text-3xl">{draftJsToPlainText(notif.message)}</p>
					</>
				</p>
			)}
			{notif.type === 'message' && (
				<p className="text-xl 2k:text-2xl">
					{' '}
					<>
						<p className="text-lg 2k:text-2xl text-slate-500 italic 2k:mb-3">You have a new message</p>
						<p className="text-xl 2k:text-3xl multi-line-truncate">{draftJsToPlainText(notif.message)}</p>
					</>
				</p>
			)}
		</div>
	);
}

export default Notification;
