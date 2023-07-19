import React from 'react';
import { useAuthContext } from '../../../../context/auth/AuthContext';
import Button from '../../../../components/buttons/Button';

/**
 * Tier 3 sub button
 * @returns
 */
function SubscribeT3Btn() {
	const { user } = useAuthContext();

	return (
		<Button
			type="ahref"
			href={process.env.REACT_APP_ENV === 'DEV' ? `${process.env.REACT_APP_TIER3_DEV_LINK}?client_reference_id=${user?.uid}` : `${process.env.REACT_APP_TIER3_PROD_LINK}?client_reference_id=${user?.uid}`}
			target="blank"
			color="btn-accent"
			text="Subscribe Tier 3"
			icon="tier3"
			size="w-3/4"
		/>
	);
}

export default SubscribeT3Btn;
