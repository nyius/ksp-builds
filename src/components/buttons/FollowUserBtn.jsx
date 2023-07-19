import React from 'react';
import { useAuthContext } from '../../context/auth/AuthContext';
import Button from './Button';
import { useHandleFollowingUser, useSetUserToFollow } from '../../context/auth/AuthActions';

/**
 * Button for following a user
 * @param {obj} usersProfile - the user to follow
 * @param {text} text - text to display on the button
 * @returns
 */
function FollowUserBtn({ usersProfile, text }) {
	const { user } = useAuthContext();
	const { handleFollowingUser } = useHandleFollowingUser();
	const [userToFollow] = useSetUserToFollow(null, usersProfile);

	//---------------------------------------------------------------------------------------------------//
	if (user && userToFollow && user.uid !== userToFollow.uid) {
		return (
			<div className="tooltip" data-tip={`${userToFollow.followers?.includes(user.uid) ? 'Unfollow' : 'Follow'}`}>
				<Button
					text={`${text ? (userToFollow.followers?.includes(user.uid) ? 'Unfollow' : 'Follow') : ''}`}
					size="w-full"
					icon={`${userToFollow.followers?.includes(user.uid) ? 'fill-heart' : 'outline-heart'}`}
					color="btn-primary"
					onClick={() => handleFollowingUser(userToFollow)}
				/>
			</div>
		);
	}
}

export default FollowUserBtn;
