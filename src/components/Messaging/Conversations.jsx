import React, { useState, useContext, useEffect, useRef, Fragment } from 'react';
import AuthContext from '../../context/auth/AuthContext';
import { setConvoTab, setDeleteConversationId } from '../../context/auth/AuthActions';
import { readMessage } from '../../context/auth/AuthUtils';
import Button from '../buttons/Button';

function Conversations() {
	const { dispatchAuth, conversations, user } = useContext(AuthContext);
	const messagesTopTef = useRef(null);
	const [convos, setConvos] = useState(null);

	const scrollToTop = () => {
		messagesTopTef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToTop();
	}, []);

	useEffect(() => {
		let sorted = conversations.sort((a, b) => {
			let aDate = a.lastMessage;
			let bDate = b.lastMessage;

			return aDate < bDate ? 1 : -1;
		});
		setConvos(sorted);
	}, [conversations]);

	/**
	 * Handles opening a convo up
	 * @param {*} convo
	 */
	const handleOpenConvo = (convo, e) => {
		if (!e.target.htmlFor) {
			setConvoTab(dispatchAuth, convo);
			readMessage(convo.id, user.uid);
		} else {
			setDeleteConversationId(dispatchAuth, convo.id);
		}
	};

	/**
	 * Handles checking whot he last message was from
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
		<>
			<div ref={messagesTopTef} />
			{convos?.length > 0 ? (
				<Fragment>
					{convos.map((message, i) => {
						return (
							<Fragment key={i}>
								{message?.messages?.length > 0 && (
									<div key={i} className="flex flex-row gap-2 2k:gap-4 items-center rounded-xl py-2 2k:py-4 hover:bg-primary cursor-pointer relative" onClick={e => handleOpenConvo(message, e)}>
										<div className="avatar">
											<div className="rounded-full w-24">
												<img src={message.userProfilePic} alt="" />
											</div>
										</div>
										<div className="flex flex-col w-full">
											<div className="flex flex-row w-full place-content-between pr-9">
												<p className="text-xl 2k:text-3xl w-1/2 text-white text-ellipsis overflow-hidden">{message.username}</p>
												<div className="flex flex-row pr-6 shrink-0 items-center">
													<p className="text-lg 2k:text-2xl text-slate-500 pr-2">
														{message.lastMessage?.seconds ? (
															<>{new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(message.lastMessage?.seconds * 1000)} </>
														) : (
															<>{message.lastMessage}</>
														)}
													</p>
													{message.newMessage && <div className="bg-sky-500 rounded-full w-4 h-4 shrink-0"></div>}
												</div>
											</div>
											<p className="text-slate-500 conversations-preview-text text-lg 2k:text-2xl">
												{checkWhoSentLastMessage(message)}: {message.messages[message.messages.length - 1].message}
											</p>
										</div>
										<Button htmlFor="delete-conversation-modal" text="x" style="btn-circle" position="absolute top-1 right-1" size="!btn-sm" />
									</div>
								)}
							</Fragment>
						);
					})}
				</Fragment>
			) : (
				<p className="text-xl 2k:text-3xl text-white text-center">No messages yet!</p>
			)}
		</>
	);
}

export default Conversations;
