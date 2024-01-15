import React from 'react';
import { useAuthContext } from '../../../context/auth/AuthContext';
import UsernameLink from '../../username/UsernameLink';
import MessageTimestamp from './MessageTimestamp';

/**
 * Displays a message bubble for a user
 * @param {string} message - the messge to display
 * @param {int} i
 * @returns
 */
function MessageBubble({ message, i }) {
	const { messageTab, user } = useAuthContext();

	return (
		<div className={`chat-bubble flex flex-col gap-2 2k:gap-4 ${messageTab.messages[i - 1]?.uid === messageTab.messages[i].uid ? (messageTab.messages[i].uid === user.uid ? 'mr-10' : 'ml-10') : ''}`}>
			<UsernameLink noHoverUi={true} username={messageTab.username} uid={messageTab.uid} />
			{message.message}
			<MessageTimestamp timestamp={message.timestamp} />
		</div>
	);
}

export default MessageBubble;
