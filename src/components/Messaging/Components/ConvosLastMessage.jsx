import React, { useContext } from 'react';
import AuthContext from '../../../context/auth/AuthContext';

/**
 * Displays who the last message was from
 * @param {*} param0
 * @returns
 */
function ConvosLastMessage({ message }) {
	const { user } = useContext(AuthContext);

	/**
	 * Handles checking who the last message was from
	 * @param {*} message
	 * @returns
	 */
	const checkWhoSentLastMessage = message => {
		if (message.lastMessageFrom !== user?.uid) {
			return message.username;
		} else {
			return user?.username;
		}
	};

	return (
		<p className="text-slate-500 conversations-preview-text text-lg 2k:text-2xl">
			{checkWhoSentLastMessage(message)}: {message.messages[message.messages.length - 1].message}
		</p>
	);
}

export default ConvosLastMessage;
