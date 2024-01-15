import React from 'react';
import UserProfilePic from '../Buttons/UserProfilePic';
import ProfileBtn from '../Buttons/ProfileBtn';
import AdminPanelBtn from '../Buttons/AdminPanelBtn';
import FavoritesBtn from '../Buttons/FavoritesBtn';
import SettingsBtn from '../Buttons/SettingsBtn';
import SignOutBtn from '../Buttons/SignOutBtn';
import { useAuthContext } from '../../../context/auth/AuthContext';
import AccoladeDashboardBtn from '../Buttons/AccoladeDashboardBtn';

/**
 * Displays the user profile dropdown
 * @returns
 */
function UserDropdown() {
	const { authLoading, user } = useAuthContext();

	if (!authLoading && user) {
		return (
			<div className="dropdown dropdown-end">
				<UserProfilePic />
				<ul tabIndex={0} className="mt-3 p-5 2k:p-6 shadow menu dropdown-content gap-2 bg-base-500 rounded-box w-96">
					<div className="flex flex-row items-center gap-2 2k:gap-4 w-full">
						<UserProfilePic />
						<div className="text-xl 2k:text-2xl text-slate-300 font-bold my-4 w-full single-line-truncate">{user.username}</div>
					</div>
					<div className="divider"></div>
					<ProfileBtn />
					<AdminPanelBtn />
					<AccoladeDashboardBtn />
					<FavoritesBtn />
					<SettingsBtn />
					<SignOutBtn />
				</ul>
			</div>
		);
	} else if (authLoading) {
		return <UserProfilePic />;
	}
}

export default UserDropdown;
