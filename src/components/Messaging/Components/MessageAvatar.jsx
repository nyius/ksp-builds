import React from 'react';

/**
 * Displays a users avatar in the message
 * @param {*} profilePicture
 * @returns
 */
function MessageAvatar({ profilePicture }) {
	return (
		<div className="chat-image avatar">
			<div className="w-10 rounded-full">
				<img src={profilePicture} />
			</div>
		</div>
	);
}

export default MessageAvatar;
