import React, { useEffect, useContext, useState } from 'react';
import { BsFillPatchCheckFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import useAuth from '../../context/auth/AuthActions';
import AuthContext from '../../context/auth/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase.config';
import BotwBadge from '../../assets/BotW_badge2.png';
import Tier1Badge from '../../assets/badges/tier1/tier1_badge36.png';
import Tier2Badge from '../../assets/badges/tier2/tier2_badge36.png';
import Tier3Badge from '../../assets/badges/tier3/tier3_badge36.png';
import Intercept_Logo from '../../assets/ig_logo_192.png';

function UsernameLink({ username, uid, hoverPosition, noHoverUi, color }) {
	const { user, hoverUser } = useContext(AuthContext);
	const navigate = useNavigate();
	const { fetchConversation, setReport, setUserToBlock, handleFollowingUser } = useAuth();
	const [hover, setHover] = useState(false);
	const [usersProfile, setUsersProfile] = useState(null);
	const [loadingProfile, setLoadingProfile] = useState(true);
	let hoverTimer, hoverOutTimer;

	const handleBlur = e => {
		if (!e.currentTarget.contains(e.relatedTarget)) {
			cancelHoverTimer();

			hoverOutTimer = setTimeout(() => {
				setHover(false);
			}, 400);
		}
	};

	const handleHover = () => {
		cancelHoverOutTimer();

		hoverTimer = setTimeout(() => {
			setHover(true);
		}, 400);
	};

	const cancelHoverTimer = () => {
		clearTimeout(hoverTimer);
	};

	const cancelHoverOutTimer = () => {
		clearTimeout(hoverOutTimer);
	};

	/**
	 * Handles setting the reported comment
	 */
	const handleSetReport = () => {
		setReport('user', { uid, username });
	};

	/**
	 * handles setting the user to blocks id for the modal
	 */
	const handleSetUserToBlock = () => {
		setUserToBlock(uid);
	};

	useEffect(() => {
		const fetchUserProfile = async () => {
			try {
				if (uid) {
					let userSnap = await getDoc(doc(db, 'userProfiles', uid));

					const data = userSnap.data();
					setLoadingProfile(false);
					setUsersProfile(data);
				}
			} catch (error) {
				console.log(error);
			}
		};

		fetchUserProfile();
	}, []);

	//---------------------------------------------------------------------------------------------------//
	return (
		<>
			<div className="dropdown z-100" onMouseEnter={handleHover} onMouseLeave={e => handleBlur(e)} onClick={e => e.stopPropagation()}>
				{!loadingProfile && (
					<>
						<div id="userlink" className={`text-2xl 2k:text-3xl link link-hover link-accent flex flex-row gap-2 items-center`} onClick={() => navigate(`/profile/${username}`)} style={{ color: `${usersProfile?.customUsernameColor}` }}>
							{username}
							{username === 'nyius' && <BsFillPatchCheckFill />}
							{username === 'interceptgames' && (
								<div className="tooltip" data-tip="Official KSP2 Developer">
									<img src={Intercept_Logo} className="w-12" alt="" />
								</div>
							)}
							{usersProfile?.subscribed === 'tier1' && (
								<div className="tooltip" data-tip="Tier 1 Subscriber">
									<img src={Tier1Badge} className="w-8 h-8 drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]" />
								</div>
							)}
							{usersProfile?.subscribed === 'tier2' && (
								<div className="tooltip" data-tip="Tier 2 Subscriber">
									<img src={Tier2Badge} className="w-8 h-8 drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]" />
								</div>
							)}
							{usersProfile?.subscribed === 'tier3' && (
								<div className="tooltip" data-tip="Tier 3 Subscriber">
									<img src={Tier3Badge} className="w-8 h-8 drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]" />
								</div>
							)}
						</div>

						{!noHoverUi && hover && (
							<div
								className={`absolute z-50 -top-0 -translate-x-1/3 -translate-y-full ${hoverPosition === 'right' && '!-translate-x-0'} ${hoverPosition === 'bottom-right' && '!top-6 !translate-y-0 !-translate-x-0'} ${
									hoverPosition === 'top-left' && '!-translate-x-3/4'
								} cursor-auto bg-base-900 p-2 shadow ${color ? color : 'bg-base-100'}  rounded-box w-130 2k:w-160`}
							>
								<div className="flex flex-col p-3 w-full">
									<div className="flex flex-row gap-3 2k:gap-5 mb-2 items-center">
										<div className="btn btn-circle w-14 h-14 2k:w-20 2k:h-20 2k:btn-lg avatar">
											{!loadingProfile && usersProfile && (
												<div className="w-10 2k:w-20 rounded-full" onClick={() => navigate(`/profile/${username}`)}>
													<img src={usersProfile.profilePicture} alt="" />
												</div>
											)}
										</div>
										<div className="flex flex-col gap-2">
											<div className="flex flex-row gap-2">
												<p className="text-xl 2k:text-2xl text-white font-bold" style={{ color: `${usersProfile?.customUsernameColor}` }}>
													{username}
												</p>
												{!loadingProfile && usersProfile && (
													<p className="text-xl 2k:text-2xl text-slate-400 italic">
														joined {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(usersProfile.dateCreated.seconds * 1000)}
													</p>
												)}
											</div>
											<p className="text-xl 2k:text-2xl text-slate-400">
												Rocket Reputation: <span className="text-white">{usersProfile.rocketReputation}</span>
											</p>
										</div>
									</div>

									<div className="flex flex-row gap-2 2k:gap-4 w-full items-end">
										{username === 'nyius' && <p className="text-xl 2k:text-2xl text-secondary font-bold">KSP Builds Founder</p>}
										{usersProfile?.buildOfTheWeekWinner && (
											<div className="tooltip" data-tip="Build of the Week Winner">
												<img src={BotwBadge} alt="" className="w-22" />
											</div>
										)}
										{usersProfile?.subscribed === 'tier1' && (
											<div className="tooltip" data-tip="Tier 1 Subscriber">
												<img src={Tier1Badge} alt="" className="w-22" />
											</div>
										)}
										{usersProfile?.subscribed === 'tier2' && (
											<div className="tooltip" data-tip="Tier 2 Subscriber">
												<img src={Tier2Badge} alt="" className="w-22" />
											</div>
										)}
										{usersProfile?.subscribed === 'tier3' && (
											<div className="tooltip" data-tip="Tier 3 Subscriber">
												<img src={Tier3Badge} alt="" className="w-22" />
											</div>
										)}
									</div>
									<div className="divider"></div>

									{/* ------------------------------------------ Buttons ------------------------------------------ */}
									<div className="flex flex-col flex-wrap gap-2 2k:gap-4 w-full">
										<div className="flex flex-row items-center flex-wrap gap-4 2k:gap-6 w-full">
											{user?.username && user?.username !== username && <Button id="userLinkMessage" text="Message" icon="message" color="btn-primary" size="w-fit" onClick={e => fetchConversation({ username, uid })} />}
											<Button text="Visit" color="btn-primary" size="w-fit" icon="export" type="ahref" href={`/profile/${username}`} />
											{user?.username && user?.username !== username && (
												<div className="tooltip" data-tip={`${usersProfile?.followers?.includes(user?.uid) ? 'Unfollow' : 'Follow'}`}>
													<Button icon={`${usersProfile?.followers?.includes(user?.uid) ? 'fill-heart' : 'outline-heart'}`} color="btn-primary" onClick={() => handleFollowingUser()} />
												</div>
											)}
										</div>
										<div className="flex flex-row items-center flex-wrap gap-2 2k:gap-4 w-full">
											{user?.username && user?.username !== username && <Button htmlFor="report-modal" color="btn-ghost" icon="report" size="!btn-sm w-fit" text="Report" onClick={handleSetReport} />}
											{user?.username && user?.username !== username && (
												<Button htmlFor="block-modal" color="btn-ghost" icon="cancel" size="!btn-sm w-fit" text={user?.blockList?.includes(uid) ? 'Unblock' : 'Block'} onClick={handleSetUserToBlock} />
											)}
										</div>
									</div>
								</div>
							</div>
						)}
					</>
				)}
			</div>
		</>
	);
}

export default UsernameLink;
