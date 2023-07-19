import React from 'react';
import Button from './Button';
import { useAuthContext } from '../../context/auth/AuthContext';
import { useFetchConversation, useSetUserToMessage } from '../../context/auth/AuthActions';

/**
 * Button to message a user
 * @returns
 */
function MessageUserBtn({ usersProfile, text }) {
	const { user } = useAuthContext();
	const { fetchConversation } = useFetchConversation();
	const [userToMessage] = useSetUserToMessage(null, usersProfile);

	if (user && userToMessage && user.uid !== userToMessage.uid) {
		return (
			<>
				{!userToMessage.blockList?.includes(user?.uid) && (userToMessage.allowPrivateMessaging === true || userToMessage.allowPrivateMessaging === undefined) && (
					<div className="tooltip" data-tip="Message">
						<Button text={text} size="w-full" icon="comment" color="btn-primary" onClick={() => fetchConversation(userToMessage)} />
					</div>
				)}
			</>
		);
	}
}

export default MessageUserBtn;
