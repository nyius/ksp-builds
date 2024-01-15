import React from 'react';
import { toast } from 'react-toastify';
import { useAuthContext } from '../../../context/auth/AuthContext';
import { useUpdateProfile } from '../../../context/auth/AuthActions';
import { updateUserProfilesAndDb } from '../../../context/auth/AuthUtils';

function Messaging() {
	const { user, dispatchAuth } = useAuthContext();

	/**
	 * Listens for changes to messaging settings
	 * @param {*} e
	 */
	const handleMessagingChange = e => {
		if (user.allowPrivateMessaging !== undefined) {
			updateUserProfilesAndDb(dispatchAuth, { allowPrivateMessaging: !user.allowPrivateMessaging }, user);
			toast.success('Saved');
		} else {
			updateUserProfilesAndDb(dispatchAuth, { allowPrivateMessaging: false }, user);
			toast.success('Saved');
		}
	};

	//---------------------------------------------------------------------------------------------------//
	return (
		<>
			<div className="flex flex-col gap-2 2k:gap-4">
				<div className="text-xl 2k:text-3xl text-white font-bold">Messaging</div>
				<label className="cursor-pointer label w-fit gap-2">
					<input id="comment" onChange={handleMessagingChange} type="checkbox" defaultChecked={user.allowPrivateMessaging === undefined ? true : user.allowPrivateMessaging ? true : false} className="checkbox checkbox-success" />
					<span className="label-text text-xl 2k:text-2xl">Allow private messages</span>
				</label>
			</div>
		</>
	);
}

export default Messaging;
