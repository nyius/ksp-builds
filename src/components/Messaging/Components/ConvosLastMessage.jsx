import React from 'react';
import { useAuthContext } from '../../../context/auth/AuthContext';

/**
 * Handles checking who the last message was from
 * @param {*} message
 * @returns
 */
const checkWhoSentLastMessage = (user, message) => {
	if (message.lastMessageFrom !== user?.uid) {
		return message.username;
	} else {
		return user?.username;
	}
};

/**
 * Displays who the last message was from
 * @param {*} message
 * @returns
 */
function ConvosLastMessage({ message }) {
	const { user } = useAuthContext();

	return (
		<p className="text-slate-500 conversations-preview-text text-lg 2k:text-2xl">
			{checkWhoSentLastMessage(user, message)}: {message.messages[message.messages.length - 1].message}
		</p>
	);
}

export default ConvosLastMessage;
