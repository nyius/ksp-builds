import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AuthContext from '../../context/auth/AuthContext';
import Button from '../buttons/Button';
import Conversation from './Conversation';
import Conversations from './Conversations';
import { setConvoTab, useSendMessage } from '../../context/auth/AuthActions';
import DeleteConversationModal from '../modals/DeleteConversationModal';

function Messaging() {
	const [message, setMessage] = useState('');
	const [convosOpen, setConvosOpen] = useState(false);
	const { sendMessage } = useSendMessage();
	const [newMessages, setNewMessages] = useState(0);
	const { dispatchAuth, authLoading, user, messageTab, conversations } = useContext(AuthContext);
	const sendMessageBox = document.getElementById('sendMessageBox');

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
				<div>
					{/* Bottom Button */}
					<div className="fixed bottom-0 right-10 z-100">
						<div className="indicator">
							{newMessages !== 0 && <span className="indicator-item badge badge-secondary z-100 text-xl p-4">{newMessages}</span>}
							<Button onClick={() => setConvosOpen(true)} text={'chat'} icon={'message'} color="bg-base-900 text-white" css="shadow-xl font-bold !text-3xl" />
						</div>
					</div>

					{/* Messages/convo box */}
					{convosOpen ? (
						<div id="messageBox" className={`h-220 w-full sm:w-180 rounded-xl p-5 bg-base-900 !fixed ${messageTab ? '!bottom-32 2k:!bottom-38' : '!bottom-12 2k:!bottom-16'} right-2 z-101`}>
							<div className="relative w-full h-full flex flex-col">
								<div className="flex flex-row place-content-between h-10 items-center">
									{messageTab ? <Button icon="left2" style="btn-circle" color="btn-primary" onClick={() => setConvoTab(dispatchAuth, null)} /> : <div className="text-xl 2k:text-2xl pixel-font">Messages</div>}
									<Button onClick={() => setConvosOpen(false)} icon="chevron-down" style="btn-circle" color="btn-primary" />
								</div>
								<div className="w-full h-120 overflow-auto scrollbar flex-nowrap absolute bottom-0 border-t-2 border-dashed border-slate-500">{messageTab ? <Conversation /> : <Conversations />}</div>
							</div>
						</div>
					) : null}

					{/* Handles sending a message */}
					{messageTab && convosOpen ? (
						<ul className="w-full sm:w-180 menu dropdown-content rounded-xl p-5 bg-base-900 !fixed !bottom-12 2k:!bottom-16 right-2 z-101">
							{!messageTab.blocked && !user?.blockList?.includes(messageTab.otherUser) ? (
								<input autoComplete="off" onKeyDown={handleSendMessage} id="sendMessageBox" type="text" placeholder="enter message" className="input w-full text-xl 2k:text-3xl" onChange={e => setMessage(e.target.value)} />
							) : (
								<div className="input w-full bg-base-900"></div>
							)}
						</ul>
					) : null}
				</div>
				<DeleteConversationModal />
			</>
		);
	}
}

export default Messaging;
