import React from 'react';
import UserProfilePic from '../Buttons/UserProfilePic';
import ProfileBtn from '../Buttons/ProfileBtn';
import AdminPanelBtn from '../Buttons/AdminPanelBtn';
import FavoritesBtn from '../Buttons/FavoritesBtn';
import SettingsBtn from '../Buttons/SettingsBtn';
import SignOutBtn from '../Buttons/SignOutBtn';

/**
 * Displays the user profile dropdown
 * @returns
 */
function UserDropdown() {
	return (
		<div className="dropdown dropdown-end">
			<UserProfilePic />
			<ul tabIndex={0} className="mt-3 p-5 2k:p-6 shadow menu dropdown-content gap-2 bg-base-500 rounded-box w-96">
				<ProfileBtn />
				<AdminPanelBtn />
				<FavoritesBtn />
				<SettingsBtn />
				<SignOutBtn />
			</ul>
		</div>
	);
}

export default UserDropdown;
