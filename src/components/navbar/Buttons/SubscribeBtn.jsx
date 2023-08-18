import React from 'react';
import Button from '../../buttons/Button';
import CheckCredentials from '../../credentials/CheckCredentials';
import { setSubscribeModal } from '../../../context/auth/AuthActions';
import { useAuthContext } from '../../../context/auth/AuthContext';

/**
 * Displays the subscribe button
 * @returns
 */
function SubscribeBtn() {
	const { dispatchAuth } = useAuthContext();

	return (
		<CheckCredentials type="notSubscribed">
			<Button text="Support" onClick={() => setSubscribeModal(dispatchAuth, true)} icon="outline-star" color="text-white" css="hidden md:flex" />
		</CheckCredentials>
	);
}

export default SubscribeBtn;
