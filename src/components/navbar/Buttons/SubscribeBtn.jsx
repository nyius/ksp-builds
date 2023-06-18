import React from 'react';
import Button from '../../buttons/Button';
import CheckCredentials from '../../credentials/CheckCredentials';

/**
 * Displays the subscribe button
 * @returns
 */
function SubscribeBtn() {
	return (
		<CheckCredentials type="notSubscribed">
			<Button text="Support" icon="outline-star" htmlFor="subscribe-modal" color="text-white" css="hidden md:flex" />
		</CheckCredentials>
	);
}

export default SubscribeBtn;
