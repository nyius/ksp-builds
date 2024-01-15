import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../../context/auth/AuthContext';
import UsernameLink from '../../username/UsernameLink';
import MessageTimestamp from './MessageTimestamp';
import MessageAvatar from './MessageAvatar';
import MessageBubble from './MessageBubble';

/**
 * Displays the left side message
 * @param {obj} message
 * @param {int} i
 * @returns
 */
function LeftMessage({ message, i }) {
	const { user, messageTab } = useAuthContext();
	const [timestampDifference, setTimestampDifference] = useState(0);

	useEffect(() => {
		if (messageTab.messages[i - 1]?.uid !== messageTab.messages[i].uid) {
			setTimestampDifference(Math.abs((new Date(messageTab.messages[i]?.timestamp) - new Date(messageTab.messages[i - 1]?.timestamp)) / 1000));
		}
	}, []);

	if (message.uid !== user.uid) {
		return (
			<div className={`chat gap-4 chat-start text-xl 2k:text-3xl ${messageTab.messages[i + 1]?.uid !== messageTab.messages[i].uid ? 'mb-8' : ''}`}>
				{messageTab.messages[i - 1]?.uid !== messageTab.messages[i].uid ? <MessageAvatar profilePicture={messageTab.userProfilePic} /> : null}

				<div className={`chat-bubble flex flex-col gap-2 2k:gap-4 ${messageTab.messages[i - 1]?.uid === messageTab.messages[i].uid ? (messageTab.messages[i].uid === user.uid ? 'mr-10' : 'ml-10') : ''}`}>
					{messageTab.messages[i - 1]?.uid !== messageTab.messages[i].uid ? <UsernameLink noHoverUi={true} username={messageTab.username} uid={messageTab.uid} /> : ''}
					{message.message}
					<MessageTimestamp timestamp={message.timestamp} />
				</div>
			</div>
		);
	}
}

export default LeftMessage;
