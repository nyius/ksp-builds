import React, { useContext } from 'react';
import AuthContext from '../../../context/auth/AuthContext';

/**
 * Displays a message bubble for a user
 * @param {string} message - the messge to display
 * @param {int} i
 * @returns
 */
function MessageBubble({ message, i }) {
	const { messageTab, user } = useContext(AuthContext);

	return <div className={`chat-bubble ${messageTab.messages[i - 1]?.uid === messageTab.messages[i].uid ? (messageTab.messages[i].uid === user.uid ? 'mr-10' : 'ml-10') : ''}`}>{message}</div>;
}

export default MessageBubble;
