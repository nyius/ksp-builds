import React, { useContext, useState, useRef, useEffect, Fragment } from 'react';
import AuthContext from '../../context/auth/AuthContext';
import UsernameLink from '../buttons/UsernameLink';

function Conversation() {
	const { user, messageTab } = useContext(AuthContext);
	const messagesEndRef = useRef(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView();
	};

	useEffect(() => {
		scrollToBottom();
	}, [messageTab]);

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className="w-full sm:w-158 h-full flex flex-col">
			{messageTab.messages?.length === 0 ? (
				<p className="text-xl 2k:text-3xl text-center">No messages with {messageTab.username} yet! Be the first to send one</p>
			) : (
				<>
					{messageTab.messages?.map((message, i) => {
						return (
							<Fragment key={i}>
								{message.uid !== user.uid ? (
									<div className={`chat gap-4 chat-start text-xl 2k:text-3xl ${messageTab.messages[i + 1]?.uid !== messageTab.messages[i].uid && 'mb-8'}`}>
										{messageTab.messages[i - 1]?.uid !== messageTab.messages[i].uid && (
											<>
												<div className="chat-image avatar">
													<div className="w-10 rounded-full">
														<img src={messageTab.userProfilePic} />
													</div>
												</div>
												<div className="text-lg 2k:text-x flex flex-row items-center gap-2 chat-header">
													<UsernameLink noHoverUi={true} username={messageTab.username} uid={messageTab.uid} />
													<time className="text-lg 2k:text-xl opacity-50">{message.timestamp}</time>
												</div>
											</>
										)}
										<div className={`chat-bubble ${messageTab.messages[i - 1]?.uid === messageTab.messages[i].uid && 'ml-10'}`}>{message.message}</div>
									</div>
								) : (
									<div className={`chat gap-4 chat-end text-xl 2k:text-3xl ${messageTab.messages[i + 1]?.uid !== messageTab.messages[i].uid && 'mb-8'}`}>
										{messageTab.messages[i - 1]?.uid !== messageTab.messages[i].uid && (
											<>
												<div className="chat-image avatar">
													<div className="w-10 rounded-full">
														<img src={user.profilePicture} />
													</div>
												</div>
												<div className="text-lg 2k:text-xl flex flex-row items-center gap-2 chat-header">
													<time className="text-lg 2k:text-xl opacity-50">{message.timestamp}</time>
													<UsernameLink noHoverUi={true} username={user.username} uid={user.uid} />
												</div>
											</>
										)}
										<div className={`chat-bubble ${messageTab.messages[i - 1]?.uid === messageTab.messages[i].uid && 'mr-10'}`}>{message.message}</div>
									</div>
								)}
							</Fragment>
						);
					})}
				</>
			)}
			<div ref={messagesEndRef} />
		</div>
	);
}

export default Conversation;
