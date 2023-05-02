import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AuthContext from '../../context/auth/AuthContext';
import Button from '../buttons/Button';
import Conversation from './Conversation';
import Conversations from './Conversations';
import useAuth from '../../context/auth/AuthActions';
import DeleteConversationModal from '../modals/DeleteConversationModal';

function Messaging() {
	const [message, setMessage] = useState('');
	const [blurClose, setBlurClose] = useState(false);
	const { setMessageTab, sendMessage } = useAuth();
	const [newMessages, setNewMessages] = useState(0);
	const [otherUser, setOtherUser] = useState(null);
	const { authLoading, user, messageTab, conversations } = useContext(AuthContext);
	const conversationBox = document.getElementById('conversationBox');
	const sendMessageBox = document.getElementById('sendMessageBox');

	/**
	 * Listens for when a user clicks off of the conversations window
	 */
	const handleBlur = e => {
		if (!e.currentTarget.contains(e.relatedTarget)) {
			conversationBox.classList.remove('dropdown-open');
			setBlurClose(true);
		}
	};

	/**
	 * Handles sending a message
	 * @param {*} e
	 * @returns
	 */
	const handleSendMessage = e => {
		if (e.key === 'Enter') {
			if (message === '') {
				console.log(`No message`);
				toast.error('No message entered!');
				return;
			}

			const newMessage = message.trim();

			sendMessage(newMessage);
			setMessage('');
			sendMessageBox.value = '';
		}
	};

	/**
	 * Resets the current convo if user clicks the chat button
	 */
	const handleChatBtnClick = () => {
		if (messageTab && !blurClose) {
			setMessageTab(null);
		}
		setBlurClose(false);
	};

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
	if (!authLoading && user?.username) {
		return (
			<>
				<div id="conversationBox" className="dropdown dropdown-end" onBlur={e => handleBlur(e)}>
					<div className="fixed bottom-0 right-10 z-100">
						<div className="indicator">
							{newMessages !== 0 && <span className="indicator-item badge badge-secondary z-100 text-xl p-4">{newMessages}</span>}
							<Button
								onClick={handleChatBtnClick}
								text={messageTab && !blurClose ? 'Convos' : 'chat'}
								icon={messageTab && !blurClose ? 'left2' : 'message'}
								tabIndex={0}
								color="bg-base-900 text-white"
								css="shadow-xl font-bold !text-3xl"
							/>
						</div>
					</div>
					<ul
						id="messageBox"
						tabIndex={0}
						className={`h-120 w-full sm:w-180 overflow-auto scrollbar flex-nowrap rounded-xl p-5 bg-base-900 !fixed ${messageTab ? '!bottom-32 2k:!bottom-38' : '!bottom-12 2k:!bottom-16'} right-2 z-101 menu dropdown-content`}
					>
						{messageTab ? <Conversation /> : <Conversations />}
					</ul>

					{/* Handles sending a message */}
					{messageTab && (
						<ul tabIndex={0} className="w-full sm:w-180 menu dropdown-content rounded-xl p-5 bg-base-900 !fixed !bottom-12 2k:!bottom-16 right-2 z-101">
							{!messageTab.blocked && !user?.blockList?.includes(messageTab.otherUser) ? (
								<input autoComplete="off" onKeyDown={handleSendMessage} id="sendMessageBox" type="text" placeholder="enter message" className="input w-full text-xl 2k:text-3xl" onChange={e => setMessage(e.target.value)} />
							) : (
								<div className="input w-full bg-base-900"></div>
							)}
						</ul>
					)}
				</div>
				<DeleteConversationModal />
			</>
		);
	}
}

export default Messaging;
