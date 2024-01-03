import React from 'react';
import { useAuthContext } from '../../../context/auth/AuthContext';
import LogoIcon from '../../../assets/logo_light_icon.png';
import CheckCredentials from '../../credentials/CheckCredentials';

/**
 * Displays the users profile pic in a circle avatar
 * @returns
 */
function UserProfilePic() {
	const { user } = useAuthContext();

	return (
		<label tabIndex={0} className="btn btn-circle w-14 h-14 2k:w-20 2k:h-20 2k:btn-lg avatar">
			<div className="w-10 2k:w-20 rounded-full">
				<CheckCredentials type="user">
					<img src={user?.profilePicture ? user?.profilePicture : LogoIcon} />
				</CheckCredentials>
			</div>
		</label>
	);
}

export default UserProfilePic;
