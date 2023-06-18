import React, { useContext, useState, useEffect } from 'react';
import Button from './Button';
import AuthContext from '../../context/auth/AuthContext';
import { useFetchConversation } from '../../context/auth/AuthActions';

/**
 * Button to message a user
 * @returns
 */
function MessageUserBtn({ usersProfile, text }) {
	const { openProfile, user } = useContext(AuthContext);
	const { fetchConversation } = useFetchConversation();
	const [userProfile, setUserProfile] = useState(null);

	useEffect(() => {
		if (usersProfile) {
			setUserProfile(usersProfile);
		} else {
			setUserProfile(openProfile);
		}
	}, []);

	if (user && userProfile && user.uid !== userProfile.uid) {
		return (
			<>
				{!userProfile.blockList?.includes(user?.uid) && (userProfile.allowPrivateMessaging === true || userProfile.allowPrivateMessaging === undefined) && (
					<div className="tooltip" data-tip="Message">
						<Button text={text} size="w-full" icon="comment" color="btn-primary" onClick={() => fetchConversation(userProfile)} />
					</div>
				)}
			</>
		);
	}
}

export default MessageUserBtn;
