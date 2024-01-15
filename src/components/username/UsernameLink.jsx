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
import { usePopperTooltip } from 'react-popper-tooltip';
import GiveAccoladeBtn from '../buttons/GiveAccoladeBtn';

/**
 * Displays the users username as a link. Also displays a hover popup menu.
 * @param {string} username
 * @param {string} uid
 * @param {bool} noHoverUi - (optional) true if you dont want the hover popup to appear
 * @param {bool} color - (optional) - if want to show a custom users color
 * @param {bool} css - (optional) - custom css
 * @returns
 */
function UsernameLink({ username, uid, noHoverUi, color, css }) {
	const navigate = useNavigate();
	const [usersProfile, loadingProfile] = useReturnUserProfile(null, uid);
	const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } = usePopperTooltip({ interactive: true, delayShow: 300, delayHide: 300 });

	//---------------------------------------------------------------------------------------------------//
	return (
		<>
			<div
				className="dropdown username-link h-8"
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
							className={`text-2xl z-10 2k:text-3xl link link-hover link-accent flex flex-row gap-2 items-center ${css ? css : ''} `}
							onClick={() => navigate(`/user/${username}`)}
							style={{ color: `${usersProfile?.customUsernameColor}` }}
							ref={setTriggerRef}
						>
							{username}
							<UsernameBadges usersProfile={usersProfile} />
						</div>

						{visible && !noHoverUi && (
							<div ref={setTooltipRef} {...getTooltipProps({ className: `tooltip-container !text-2xl !2k:text-3xl ${color ? color : 'bg-base-600'} !text-slate-300 !border-none !p-4 min-w-[30rem] ` })}>
								<div {...getArrowProps({ className: `tooltip-arrow ${color ? color : '!bg-base-600 '}` })} />
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
											<GiveAccoladeBtn username={username} />
										</div>
										<div className="flex flex-row items-center flex-wrap gap-2 2k:gap-4 w-full">
											<ReportUserBtn userToReport={usersProfile} />
											<BlockUserBtn userToBlock={usersProfile} />
										</div>
									</div>
								</div>
							</div>
						)}
					</>
				) : null}
			</div>
		</>
	);
}

export default UsernameLink;
