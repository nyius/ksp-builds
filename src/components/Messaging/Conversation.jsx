import React, { useRef, Fragment } from 'react';
import { useAuthContext } from '../../context/auth/AuthContext';
import LeftMessage from './Components/LeftMessage';
import RightMessage from './Components/RightMessage';
import { useScrollToElement } from '../../hooks/ScrollToElement';

/**
 * Displays an open conversation with a user
 * @returns
 */
function Conversation() {
	const { messageTab } = useAuthContext();
	const messagesEndRef = useRef(null);

	useScrollToElement(messagesEndRef, [messageTab]);

	//---------------------------------------------------------------------------------------------------//
	if (messageTab.messages?.length === 0) {
		return (
			<div className="w-full sm:w-158 h-full flex flex-col">
				<p className="text-xl 2k:text-3xl text-center">No messages with {messageTab.username} yet! Be the first to send one</p>
			</div>
		);
	}

	return (
		<div className="w-full sm:w-158 h-full flex flex-col">
			{messageTab.messages?.map((message, i) => {
				return (
					<Fragment key={i}>
						<LeftMessage message={message} i={i} />
						<RightMessage message={message} i={i} />
					</Fragment>
				);
			})}
			<div className="pb-6" ref={messagesEndRef} />
		</div>
	);
}

export default Conversation;
