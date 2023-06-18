import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Displays the users profile picture when hovering a username
 * @param {*} loading - current loading state of the users profile
 * @param {*} usersProfile - users profile
 * @returns
 */
function UserProfilePicture({ loading, usersProfile }) {
	const navigate = useNavigate();

	if (!loading && usersProfile) {
		return (
			<div className="btn btn-circle w-14 h-14 2k:w-20 2k:h-20 2k:btn-lg avatar">
				<div className="w-10 2k:w-20 rounded-full" onClick={() => navigate(`/user/${usersProfile.username}`)}>
					<img src={usersProfile.profilePicture} alt="" />
				</div>
			</div>
		);
	}
}

export default UserProfilePicture;
