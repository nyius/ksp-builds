import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { setOpenedHangar, useResetOpenHangar } from '../../../context/hangars/HangarActions';
import { useHangarContext } from '../../../context/hangars/HangarContext';
import useBuilds from '../../../context/builds/BuildsActions';
import { useAuthContext } from '../../../context/auth/AuthContext';
import { ReactComponent as HangarIcon } from '../../../assets/hangar.svg';

/**
 * Displays the breadcrumb navbar above the hangars list
 * @param {string} currentUser - takes in the users username (to use for sharing link generation)
 * @returns
 */
function HangarsNavbar() {
	const { dispatchHangars, openedHangar, currentHangarOwner } = useHangarContext();
	const { openProfile, user } = useAuthContext();
	const { fetchBuildsById } = useBuilds();

	const navigate = useNavigate();
	const location = useLocation();
	let currentLocation = location.pathname.split('/')[1];
	let isInHangar = location.pathname.split('/')[2];

	useResetOpenHangar();

	return (
		<div className="text-xl 2k:text-2xl breadcrumbs">
			<ul>
				<li
					onClick={() => {
						setOpenedHangar(dispatchHangars, null);
						if (currentLocation === 'user') {
							navigate(`/user/${currentHangarOwner}`);
							fetchBuildsById(openProfile.builds, openProfile.uid, 'user');
						} else if (currentLocation === 'profile') {
							if (isInHangar) {
								navigate(`/profile`);
								fetchBuildsById(user.builds, user.uid, 'user');
							}
						}
					}}
				>
					<a className="flex flex-row gap-3">
						<HangarIcon className="h-16 w-16" fill="#a6adbb" /> {currentHangarOwner === user?.username ? 'Your Hangars' : `${currentHangarOwner}'s Hangars`}
					</a>
				</li>
				{openedHangar ? (
					<li>
						<a className="flex flex-row gap-3">{openedHangar.hangarName}</a>
					</li>
				) : null}
			</ul>
		</div>
	);
}

export default HangarsNavbar;
