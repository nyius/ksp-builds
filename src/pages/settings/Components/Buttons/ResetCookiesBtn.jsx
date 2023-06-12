import React from 'react';
import Button from '../../../../components/buttons/Button';
import { resetCookieConsentValue } from 'react-cookie-consent';
import { toast } from 'react-toastify';

/**
 * Reset Cookies Button
 * @returns
 */
function ResetCookiesBtn() {
	return (
		<Button
			text="Reset"
			color="btn-accent"
			icon="reset"
			onClick={() => {
				resetCookieConsentValue();
				toast.success('Consent reset! Reload the page to choose again.');
			}}
		/>
	);
}

export default ResetCookiesBtn;
