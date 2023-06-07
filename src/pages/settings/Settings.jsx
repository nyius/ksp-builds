import React, { useEffect, useContext, useState } from 'react';
import { resetCookieConsentValue } from 'react-cookie-consent';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { TwitterPicker } from 'react-color';
import PlanetHeader from '../../components/header/PlanetHeader';
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';
import useResetStates from '../../utilities/useResetStates';
import Button from '../../components/buttons/Button';
import AuthContext from '../../context/auth/AuthContext';
import { updateUsernameColor } from '../../context/auth/AuthUtils';
import { setAccountToDelete, useUpdateProfile } from '../../context/auth/AuthActions';

function Settings() {
	const [usernameColor, setUsernameColor] = useState(null);
	const { resetStates } = useResetStates();
	const { user, authLoading, dispatchAuth } = useContext(AuthContext);
	const { updateUserDb, updateUserProfilesAndDb } = useUpdateProfile();

	useEffect(() => {
		resetStates();
	}, []);

	useEffect(() => {
		if (!authLoading && user?.username) {
			if (user.customUsernameColor) {
				setUsernameColor(user.customUsernameColor);
			}
		}
	}, [authLoading]);

	/**
	 * Listens for changes for notifications
	 * @param {*} e
	 */
	const handleNotificationsChange = e => {
		if (e.target.id === 'blockAll') {
			if (e.target.checked) {
				const userBlockedNotifs = ['comment', 'reply', 'newBuild', 'update', 'challenge'];
				updateUserDb({ blockedNotifications: userBlockedNotifs, notificationsAllowed: false });
				toast.success('Saved');
			} else {
				updateUserDb({ blockedNotifications: [], notificationsAllowed: true });
				toast.success('Saved');
			}
		} else {
			if (user.blockedNotifications) {
				// check if they want that notification. If they do, remove it from their blocked array
				if (e.target.checked) {
					const userBlockedNotifs = [...user.blockedNotifications.filter(el => el !== e.target.id)];
					updateUserDb({ blockedNotifications: userBlockedNotifs });
					toast.success('Saved');
				} else {
					// If they're unchecking it, add it to their blocked notifs
					const userBlockedNotifs = [...user.blockedNotifications, e.target.id];
					updateUserDb({ blockedNotifications: userBlockedNotifs });
					toast.success('Saved');
				}
			} else {
				updateUserDb({ blockedNotifications: [e.target.id] });
				toast.success('Saved');
			}
		}
	};

	/**
	 * Listens for changes to messaging settings
	 * @param {*} e
	 */
	const handleMessagingChange = e => {
		if (user.allowPrivateMessaging !== undefined) {
			updateUserProfilesAndDb({ allowPrivateMessaging: !user.allowPrivateMessaging });
			toast.success('Saved');
		} else {
			updateUserProfilesAndDb({ allowPrivateMessaging: false });
			toast.success('Saved');
		}
	};

	/**
	 * Handles a user changing their username color
	 * @param {*} color
	 * @param {*} e
	 */
	const handleUsernameColorChange = (color, e) => {
		setUsernameColor(color.hex);
	};

	//---------------------------------------------------------------------------------------------------//
	return (
		<>
			<Helmet>
				<meta charSet="utf-8" />
				<title>KSP Builds - Settings</title>
				<link rel="canonical" href={`https://kspbuilds.com/settings`} />
			</Helmet>

			<MiddleContainer>
				<PlanetHeader text="Settings" />

				{!authLoading && user && (
					<>
						<div className="flex flex-col gap-2 2k:gap-4">
							<div className="text-xl 2k:text-3xl text-white font-bold">Notifications</div>
							<label className="cursor-pointer label w-fit gap-2">
								<input id="comment" onChange={handleNotificationsChange} type="checkbox" defaultChecked={user.blockedNotifications?.includes('comment') ? false : true} className="checkbox checkbox-success" />
								<span className="label-text text-xl 2k:text-2xl">Comments on your builds</span>
							</label>
							<label className="cursor-pointer label w-fit gap-2">
								<input id="reply" onChange={handleNotificationsChange} type="checkbox" defaultChecked={user.blockedNotifications?.includes('reply') ? false : true} className="checkbox checkbox-success" />
								<span className="label-text text-xl 2k:text-2xl">Replies to your comments</span>
							</label>
							<label className="cursor-pointer label w-fit gap-2">
								<input id="newBuild" onChange={handleNotificationsChange} type="checkbox" defaultChecked={user.blockedNotifications?.includes('newBuild') ? false : true} className="checkbox checkbox-success" />
								<span className="label-text text-xl 2k:text-2xl">Followed users build upload</span>
							</label>
							<label className="cursor-pointer label w-fit gap-2">
								<input id="update" onChange={handleNotificationsChange} type="checkbox" defaultChecked={user.blockedNotifications?.includes('update') ? false : true} className="checkbox checkbox-success" />
								<span className="label-text text-xl 2k:text-2xl">Site Updates</span>
							</label>
							<label className="cursor-pointer label w-fit gap-2">
								<input id="challenge" onChange={handleNotificationsChange} type="checkbox" defaultChecked={user.blockedNotifications?.includes('challenge') ? false : true} className="checkbox checkbox-success" />
								<span className="label-text text-xl 2k:text-2xl">New Challenges</span>
							</label>
							<label className="cursor-pointer label w-fit gap-2">
								<input id="blockAll" onChange={handleNotificationsChange} type="checkbox" defaultChecked={user.notificationsAllowed ? false : true} className="checkbox checkbox-success" />
								<span className="label-text text-xl 2k:text-2xl">Block All Notifications</span>
							</label>
						</div>

						{/* ----------------------------------- Username Color ----------------------------------- */}
						<div className="divider"></div>
						<div className="text-xl 2k:text-3xl text-white font-bold mb-4">Username Color</div>
						<div style={{ color: `${usernameColor}` }} className={`text-2xl 2k:text-4xl font-bold mb-4 text-accent`}>
							{user.username}
						</div>
						<div className="flex flex-row gap-4 2k:gap-8 w-full flex-wrap">
							<TwitterPicker
								colors={user?.subscribed ? ['#1fb2a5', '#661ae6', '#d926aa', '#FF6900', '#FCB900', '#7BDCB5', '#00D084', '#8ED1FC', '#0693E3', '#ABB8C3', '#EB144C', '#F78DA7', '#9900EF'] : ['#1fb2a5']}
								onChange={handleUsernameColorChange}
							/>
							<div className="flex flex-col w-fit">
								<p className="text-xl 2k:text-2xl text-slate-300 mb-3 text-center">Light Mode</p>
								<div className="w-full h-44 px-20 text-2xl 2k:text-4xl font-bold items-center flex justify-center text-accent rounded-xl bg-slate-100" style={{ color: `${usernameColor}` }}>
									{user.username}
								</div>
							</div>
							<div className="flex flex-col w-fit">
								<p className="text-xl 2k:text-2xl text-slate-300 mb-3 text-center">Dark Mode</p>
								<div className="w-full h-44 px-20 text-2xl 2k:text-4xl font-bold items-center flex justify-center text-accent rounded-xl bg-base-800" style={{ color: `${usernameColor}` }}>
									{user.username}
								</div>
							</div>
						</div>
						{user?.subscribed ? (
							<> {usernameColor && <Button text="Save" icon="save" color="btn-accent" size="w-fit" onClick={() => updateUsernameColor(user.uid, usernameColor)} />} </>
						) : (
							<div className="text-2xl 2k:text-3xl">Subscribe to change your username color! </div>
						)}

						{/* ----------------------------------- SUSBCRIPTION ----------------------------------- */}
						<div className="divider"></div>
						<div className="text-xl 2k:text-3xl text-white font-bold">Subscription</div>
						<h4 className="text-xl 2k:text-3xl text-white">Support every month by Subscribing to help keep KSP Builds running and join an amazing group of space enthusiasts.</h4>
						{user?.subscribed ? (
							<Button
								type="ahref"
								href={process.env.REACT_APP_ENV === 'DEV' ? process.env.REACT_APP_MANAGE_SUBSCRIPTION_DEV : process.env.REACT_APP_MANAGE_SUBSCRIPTION_PROD}
								target="blank"
								color="btn-accent"
								text="Manage Subscription"
								icon="head"
								size="w-fit"
							/>
						) : (
							<div className="flex flex-col gap-4 2k:gap-8 w-1/2">
								<div className="text-3xl 2k:text-4xl text-slate-300 font-bold mb-4 2k:mb-8">Tiers</div>
								<div className="flex flex-row items-center">
									<Button
										type="ahref"
										href={process.env.REACT_APP_ENV === 'DEV' ? `${process.env.REACT_APP_TIER1_DEV_LINK}?client_reference_id=${user?.uid}` : `${process.env.REACT_APP_TIER1_PROD_LINK}?client_reference_id=${user?.uid}`}
										target="blank"
										color="btn-primary"
										text="Subscribe Tier 1"
										icon="tier1"
										size="w-3/4"
									/>
									<p className="text-lg 2k:text-2xl text-white font-bold bg-base-500 rounded-xl flex items-center justify-center w-full px-6 2k:px-8 h-12 2k:h-16">US$3.66</p>
								</div>
								<div className="flex flex-row items-center">
									<Button
										type="ahref"
										href={process.env.REACT_APP_ENV === 'DEV' ? `${process.env.REACT_APP_TIER2_DEV_LINK}?client_reference_id=${user?.uid}` : `${process.env.REACT_APP_TIER2_PROD_LINK}?client_reference_id=${user?.uid}`}
										target="blank"
										color="btn-secondary"
										text="Subscribe Tier 2"
										icon="tier2"
										size="w-3/4"
									/>
									<p className="text-lg 2k:text-2xl text-white font-bold bg-base-500 rounded-xl flex items-center justify-center w-full px-6 2k:px-8 h-12 2k:h-16">US$7.33</p>
								</div>
								<div className="flex flex-row items-center">
									<Button
										type="ahref"
										href={process.env.REACT_APP_ENV === 'DEV' ? `${process.env.REACT_APP_TIER3_DEV_LINK}?client_reference_id=${user?.uid}` : `${process.env.REACT_APP_TIER3_PROD_LINK}?client_reference_id=${user?.uid}`}
										target="blank"
										color="btn-accent"
										text="Subscribe Tier 3"
										icon="tier3"
										size="w-3/4"
									/>
									<p className="text-lg 2k:text-2xl text-white font-bold bg-base-500 rounded-xl text-center w-full flex justify-center items-center px-6 2k:px-8 h-12 2k:h-16">US$14.68</p>
								</div>
							</div>
						)}

						{/* ----------------------------------- Messaging ----------------------------------- */}
						<div className="divider"></div>
						<div className="flex flex-col gap-2 2k:gap-4">
							<div className="text-xl 2k:text-3xl text-white font-bold">Messaging</div>
							<label className="cursor-pointer label w-fit gap-2">
								<input id="comment" onChange={handleMessagingChange} type="checkbox" defaultChecked={user.allowPrivateMessaging === undefined ? true : user.allowPrivateMessaging ? true : false} className="checkbox checkbox-success" />
								<span className="label-text text-xl 2k:text-2xl">Allow private messages</span>
							</label>
						</div>

						{/* ----------------------------------- Messaging ----------------------------------- */}
						<div className="divider"></div>
						<div className="flex flex-col gap-2 2k:gap-4">
							<div className="text-xl 2k:text-3xl text-white font-bold">Cookies</div>
							<p className="text-xl 2k:text-2xl text-white">Reset your cookie consent choice.</p>
							<Button
								text="Reset"
								color="btn-accent"
								icon="reset"
								onClick={() => {
									resetCookieConsentValue();
									toast.success('Consent reset! Reload the page to choose again.');
								}}
							/>
						</div>

						{/* ----------------------------------- Delete Account ----------------------------------- */}
						<div className="divider"></div>
						<p className="text-xl 2k:text-2xl text-slate-400 italic">Delete Account</p>
						<Button text="Delete Account" htmlFor="delete-account-modal" onClick={() => setAccountToDelete(dispatchAuth, user.uid)} size="w-fit" icon="delete" color="btn-error" />
					</>
				)}
			</MiddleContainer>
		</>
	);
}

export default Settings;
