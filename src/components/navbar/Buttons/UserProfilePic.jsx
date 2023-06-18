import React, { useContext } from 'react';
import AuthContext from '../../../context/auth/AuthContext';
import LogoIcon from '../../../assets/logo_light_icon.png';

/**
 * Displays the users profile pic in a circle avatar
 * @returns
 */
function UserProfilePic() {
	const { user } = useContext(AuthContext);

	return (
		<label tabIndex={0} className="btn btn-circle w-14 h-14 2k:w-20 2k:h-20 2k:btn-lg avatar">
			<div className="w-10 2k:w-20 rounded-full">
				<img src={user.profilePicture ? user.profilePicture : LogoIcon} />
			</div>
		</label>
	);
}

export default UserProfilePic;
