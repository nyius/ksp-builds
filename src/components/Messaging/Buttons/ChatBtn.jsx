import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../../../context/auth/AuthContext';
import { setConvosOpen } from '../../../context/auth/AuthActions';
import Button from '../../buttons/Button';

/**
 * Displays the 'Chat' button
 *
 * @returns
 */
function ChatBtn() {
	const { dispatchAuth, conversations, user } = useContext(AuthContext);
	const [newMessages, setNewMessages] = useState(0);

	/**
	 * Handles checking for anew message
	 * @returns
	 */
	const checkForNewMessages = () => {
		let newMessages = 0;
		if (conversations?.length > 0) {
			for (let i = 0; i < conversations.length; i++) {
				if (conversations[i]?.newMessage && conversations[i]?.lastMessageFrom !== user.uid && conversations[i]?.lastMessageFrom !== undefined) {
					newMessages++;
				}
			}
		}
		return newMessages > 99 ? '99+' : newMessages;
	};

	useEffect(() => {
		setNewMessages(checkForNewMessages());
	}, [conversations]);

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className="fixed bottom-0 right-10 z-100">
			<div className="indicator">
				{newMessages !== 0 ? <span className="indicator-item badge badge-secondary z-100 text-xl p-4">{newMessages}</span> : null}
				<Button onClick={() => setConvosOpen(dispatchAuth, true)} text="chat" icon="message" color="bg-base-900 text-white" css="shadow-xl font-bold !text-3xl" />
			</div>
		</div>
	);
}

export default ChatBtn;
