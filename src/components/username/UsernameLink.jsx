import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReturnUserProfile } from '../../context/auth/AuthActions';
import UsernameBadges from './Components/UsernameBadges';
import UserProfilePicture from './Components/UserProfilePicture';
import HoverBadges from './Components/HoverBadges';
import MessageUserBtn from '../buttons/MessageUserBtn';
import VisitBtn from './Components/Buttons/VisitBtn';
import FollowUserBtn from '../buttons/FollowUserBtn';
import ReportUserBtn from '../buttons/ReportUserBtn';
import BlockUserBtn from '../buttons/BlockUserBtn';
import UserReputation from './Components/UserReputation';
import UserJoined from './Components/UserJoined';
import UserUsername from './Components/UserUsername';

let hoverTimer, hoverOutTimer;

const handleHover = setHover => {
	cancelHoverOutTimer();

	hoverTimer = setTimeout(() => {
		setHover(true);
	}, 400);
};

const handleBlur = (e, setHover) => {
	if (!e.currentTarget.contains(e.relatedTarget)) {
		cancelHoverTimer();

		hoverOutTimer = setTimeout(() => {
			setHover(false);
		}, 400);
	}
};

const cancelHoverTimer = () => {
	clearTimeout(hoverTimer);
};

const cancelHoverOutTimer = () => {
	clearTimeout(hoverOutTimer);
};

/**
 * Displays the users username as a link. Also displays a hover popup menu.
 * @param {string} username
 * @param {string} uid
 * @param {string} hoverPosition - (optional) right, bottom-right, top-left, bottom
 * @param {bool} noHoverUi - (optional) true if you dont want the hover popup to appear
 * @param {bool} color - (optional) - if want to show a custom users color
 * @param {bool} css - (optional) - custom css
 * @returns
 */
function UsernameLink({ username, uid, hoverPosition, noHoverUi, color, css }) {
	const navigate = useNavigate();
	const [hover, setHover] = useState(false);
	const [usersProfile, loadingProfile] = useReturnUserProfile(null, uid);

	//---------------------------------------------------------------------------------------------------//
	return (
		<>
			<div
				className="dropdown username-link"
				onMouseEnter={() => handleHover(setHover)}
				onMouseLeave={e => handleBlur(e, setHover)}
				onClick={e => {
					e.stopPropagation();
					e.preventDefault();
				}}
			>
				{!loadingProfile ? (
					<>
						{/* Username */}
						<div
							id="userlink"
							className={`text-2xl z-10 2k:text-2xl link link-hover link-accent flex flex-row gap-2 items-center ${css ? css : ''} `}
							onClick={() => navigate(`/user/${username}`)}
							style={{ color: `${usersProfile?.customUsernameColor}` }}
						>
							{username}
							<UsernameBadges usersProfile={usersProfile} />
						</div>

						{/* Popup Hover */}
						{!noHoverUi && hover && usersProfile?.username ? (
							<div
								className={`absolute z-100 -top-0 -translate-x-1/3 -translate-y-full ${hoverPosition === 'right' ? '!-translate-x-0' : ''} ${hoverPosition === 'bottom-right' ? '!top-6 !translate-y-0 !-translate-x-0' : ''} ${
									hoverPosition === 'top-left' ? '!-translate-x-3/4' : ''
								} ${hoverPosition === 'bottom' ? '!top-6 !translate-y-0' : ''} cursor-auto bg-base-900 p-2 shadow ${color ? color : 'bg-base-100'}  rounded-box w-130 2k:w-160`}
							>
								<div className="flex flex-col p-3 w-full">
									<div className="flex flex-row gap-3 2k:gap-5 mb-2 items-center">
										<UserProfilePicture loading={loadingProfile} usersProfile={usersProfile} />

										<div className="flex flex-col gap-2">
											<div className="flex flex-row flex-wrap gap-2">
												<UserUsername username={username} customUsernameColor={usersProfile?.customUsernameColor} />
												<UserJoined timestamp={usersProfile?.dateCreated} />
											</div>
											<UserReputation rocketReputation={usersProfile?.rocketReputation} />
										</div>
									</div>

									<HoverBadges usersProfile={usersProfile} />

									<div className="divider"></div>

									{/* ------------------------------------------ Buttons ------------------------------------------ */}
									<div className="flex flex-col flex-wrap gap-3 2k:gap-5 w-full">
										<div className="flex flex-row items-center flex-wrap gap-3 2k:gap-5 w-full">
											<MessageUserBtn usersProfile={usersProfile} />
											<VisitBtn username={username} />
											<FollowUserBtn usersProfile={usersProfile} />
										</div>
										<div className="flex flex-row items-center flex-wrap gap-2 2k:gap-4 w-full">
											<ReportUserBtn userToReport={usersProfile} />
											<BlockUserBtn userToBlock={usersProfile} />
										</div>
									</div>
								</div>
							</div>
						) : null}
					</>
				) : null}
			</div>
		</>
	);
}

export default UsernameLink;
