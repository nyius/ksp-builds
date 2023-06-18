import React, { useContext } from 'react';
import AuthContext from '../../../context/auth/AuthContext';
import UsernameLink from '../../username/UsernameLink';
import MessageTimestamp from './MessageTimestamp';
import MessageAvatar from './MessageAvatar';
import MessageBubble from './MessageBubble';

/**
 * Displays the right side message
 * @param {obj} message
 * @param {int} i
 * @returns
 */
function RightMessage({ message, i }) {
	const { user, messageTab } = useContext(AuthContext);

	if (message.uid === user.uid) {
		return (
			<div className={`chat gap-4 chat-end text-xl 2k:text-3xl ${messageTab.messages[i + 1]?.uid !== messageTab.messages[i].uid ? 'mb-8' : ''}`}>
				{messageTab.messages[i - 1]?.uid !== messageTab.messages[i].uid ? (
					<>
						<MessageAvatar profilePicture={user.profilePicture} />
						<div className="text-lg 2k:text-xl flex flex-row items-center gap-2 chat-header">
							<MessageTimestamp timestamp={message.timestamp} />
							<UsernameLink noHoverUi={true} username={user.username} uid={user.uid} />
						</div>
					</>
				) : null}
				<MessageBubble message={message.message} i={i} />
			</div>
		);
	}
}

export default RightMessage;
