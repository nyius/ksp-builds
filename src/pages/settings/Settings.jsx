import React, { useEffect, useContext } from 'react';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import PlanetHeader from '../../components/header/PlanetHeader';
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';
import useResetStates from '../../utilities/useResetStates';
import Button from '../../components/buttons/Button';
import AuthContext from '../../context/auth/AuthContext';
import useAuth from '../../context/auth/AuthActions';

function Settings() {
	const { resetStates } = useResetStates();
	const { user, authLoading } = useContext(AuthContext);
	const { setAccountToDelete, updateUserDb, updateUserDbBlockedNotifs } = useAuth();

	useEffect(() => {
		resetStates();
	}, []);

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
			updateUserDb({ allowPrivateMessaging: !user.allowPrivateMessaging });
			toast.success('Saved');
		} else {
			updateUserDb({ allowPrivateMessaging: false });
			toast.success('Saved');
		}
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

						<div className="divider"></div>
						<div className="flex flex-col gap-2 2k:gap-4">
							<div className="text-xl 2k:text-3xl text-white font-bold">Messaging</div>
							<label className="cursor-pointer label w-fit gap-2">
								<input id="comment" onChange={handleMessagingChange} type="checkbox" defaultChecked={user.allowPrivateMessaging === undefined ? true : user.allowPrivateMessaging ? true : false} className="checkbox checkbox-success" />
								<span className="label-text text-xl 2k:text-2xl">Allow private messages</span>
							</label>
						</div>

						<div className="divider"></div>
						<p className="text-xl 2k:text-2xl text-slate-400 italic">Delete Account</p>
						<Button text="Delete Account" htmlFor="delete-account-modal" onClick={() => setAccountToDelete(user.uid)} size="w-fit" icon="delete" color="btn-error" />
					</>
				)}
			</MiddleContainer>
		</>
	);
}

export default Settings;
