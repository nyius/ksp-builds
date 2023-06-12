import React, { useContext } from 'react';
import Button from '../../../../components/buttons/Button';
import AuthContext from '../../../../context/auth/AuthContext';
import { useFetchConversation } from '../../../../context/auth/AuthActions';

/**
 * Button to message a user
 * @returns
 */
function MessageUserBtn() {
	const { fetchedUserProfile, user } = useContext(AuthContext);
	const { fetchConversation } = useFetchConversation();

	return (
		<>
			{!fetchedUserProfile.blockList?.includes(user?.uid) && (fetchedUserProfile.allowPrivateMessaging === true || fetchedUserProfile.allowPrivateMessaging === undefined) && (
				<div className="tooltip" data-tip="Message">
					<Button text="Message" size="w-full" icon="comment" color="btn-primary" onClick={() => fetchConversation(fetchedUserProfile)} />
				</div>
			)}
		</>
	);
}

export default MessageUserBtn;
