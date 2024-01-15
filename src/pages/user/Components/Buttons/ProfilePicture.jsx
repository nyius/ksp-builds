import React from 'react';
import { useAuthContext } from '../../../../context/auth/AuthContext';

/**
 * Displays a users profile picture
 * @returns
 */
function ProfilePicture() {
	const { openProfile } = useAuthContext();

	return (
		<div className="avatar mb-4 w-fit">
			<div className="rounded-full h-44 w-44 ring ring-primary ring-offset-base-100 ring-offset-4">
				<img src={openProfile.profilePicture} alt="" />
			</div>
		</div>
	);
}

export default ProfilePicture;
