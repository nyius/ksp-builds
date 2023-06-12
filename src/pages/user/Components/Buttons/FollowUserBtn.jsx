import React, { useContext } from 'react';
import AuthContext from '../../../../context/auth/AuthContext';
import Button from '../../../../components/buttons/Button';
import { useHandleFollowingUser } from '../../../../context/auth/AuthActions';

/**
 * Button for following a user
 * @returns
 */
function FollowUserBtn() {
	const { user, fetchedUserProfile } = useContext(AuthContext);
	const { handleFollowingUser } = useHandleFollowingUser();

	return (
		<div className="tooltip" data-tip={`${fetchedUserProfile.followers?.includes(user.uid) ? 'Unfollow' : 'Follow'}`}>
			<Button
				text={`${fetchedUserProfile.followers?.includes(user.uid) ? 'Unfollow' : 'Follow'}`}
				size="w-full"
				icon={`${fetchedUserProfile.followers?.includes(user.uid) ? 'fill-heart' : 'outline-heart'}`}
				color="btn-accent"
				onClick={() => handleFollowingUser()}
			/>
		</div>
	);
}

export default FollowUserBtn;
