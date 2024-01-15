import React, { useState } from 'react';
import { useAuthContext } from '../../../context/auth/AuthContext';
import { useSendMessage } from '../../../context/auth/AuthActions';
import { toast } from 'react-toastify';
import errorReport from '../../../utilities/errorReport';

/**
 * Displays the input box for sending a message
 * @returns
 */
function MessageInput() {
	const { messageTab, convosOpen, user } = useAuthContext();
	const [message, setMessage] = useState('');
	const { sendMessage } = useSendMessage();

	/**
	 * Handles sending a message
	 * @param {*} e
	 * @returns
	 */
	const handleSendMessage = e => {
		if (e.key === 'Enter') {
			if (message === '') {
				errorReport('No message', false, 'handleSendMessage');
				toast.error('No message entered!');
				return;
			}

			const newMessage = message.trim();

			sendMessage(newMessage);
			setMessage('');
			const sendMessageBox = document.getElementById('sendMessageBox');
			sendMessageBox.value = '';
		}
	};

	if (messageTab && convosOpen) {
		return (
			<ul className="w-full sm:w-180 menu dropdown-content rounded-xl p-5 bg-base-900 !fixed !bottom-12 2k:!bottom-16 right-2 z-[52]">
				{!messageTab.blocked && !user?.blockList?.includes(messageTab.otherUser) ? (
					<input autoComplete="off" onKeyDown={handleSendMessage} id="sendMessageBox" type="text" placeholder="enter message" className="input w-full text-xl 2k:text-3xl" onChange={e => setMessage(e.target.value)} />
				) : (
					<div className="input w-full bg-base-900"></div>
				)}
			</ul>
		);
	}
}

export default MessageInput;
