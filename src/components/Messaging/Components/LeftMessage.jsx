import React from 'react';
import { useAuthContext } from '../../../context/auth/AuthContext';
import UsernameLink from '../../username/UsernameLink';
import MessageTimestamp from './MessageTimestamp';
import MessageAvatar from './MessageAvatar';
import MessageBubble from './MessageBubble';

/**
 * Displays the left side message
 * @param {obj} message
 * @param {int} i
 * @returns
 */
function LeftMessage({ message, i }) {
	const { user, messageTab } = useAuthContext();

	if (message.uid !== user.uid) {
		return (
			<div className={`chat gap-4 chat-start text-xl 2k:text-3xl ${messageTab.messages[i + 1]?.uid !== messageTab.messages[i].uid ? 'mb-8' : ''}`}>
				{messageTab.messages[i - 1]?.uid !== messageTab.messages[i].uid ? (
					<>
						<MessageAvatar profilePicture={messageTab.userProfilePic} />
						<div className="text-lg 2k:text-x flex flex-row items-center gap-2 chat-header">
							<UsernameLink noHoverUi={true} username={messageTab.username} uid={messageTab.uid} />
							<MessageTimestamp timestamp={message.timestamp} />
						</div>
					</>
				) : null}
				<MessageBubble message={message.message} i={i} />
			</div>
		);
	}
}

export default LeftMessage;
