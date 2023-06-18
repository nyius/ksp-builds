import React, { useContext, useState, useEffect } from 'react';
import AuthContext from '../../context/auth/AuthContext';
import Button from './Button';
import { useHandleFollowingUser } from '../../context/auth/AuthActions';

/**
 * Button for following a user
 * @param {obj} usersProfile - the user to follow
 * @param {text} text - text to display on the button
 * @returns
 */
function FollowUserBtn({ usersProfile, text }) {
	const { user, openProfile } = useContext(AuthContext);
	const { handleFollowingUser } = useHandleFollowingUser();
	const [userProfile, setUserProfile] = useState(null);

	useEffect(() => {
		if (usersProfile) {
			setUserProfile(usersProfile);
		} else {
			setUserProfile(openProfile);
		}
	}, []);

	useEffect(() => {
		if (openProfile && openProfile?.uid === userProfile?.uid) {
			setUserProfile(openProfile);
		}
	}, [openProfile]);

	//---------------------------------------------------------------------------------------------------//
	if (user && userProfile && user.uid !== userProfile.uid) {
		return (
			<div className="tooltip" data-tip={`${userProfile.followers?.includes(user.uid) ? 'Unfollow' : 'Follow'}`}>
				<Button
					text={`${text ? (userProfile.followers?.includes(user.uid) ? 'Unfollow' : 'Follow') : ''}`}
					size="w-full"
					icon={`${userProfile.followers?.includes(user.uid) ? 'fill-heart' : 'outline-heart'}`}
					color="btn-primary"
					onClick={() => handleFollowingUser(userProfile)}
				/>
			</div>
		);
	}
}

export default FollowUserBtn;
