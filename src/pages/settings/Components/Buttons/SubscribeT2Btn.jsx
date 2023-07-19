import React from 'react';
import { useAuthContext } from '../../../../context/auth/AuthContext';
import Button from '../../../../components/buttons/Button';

/**
 * Tier 2 sub button
 * @returns
 */
function SubscribeT2Btn() {
	const { user } = useAuthContext();

	return (
		<Button
			type="ahref"
			href={process.env.REACT_APP_ENV === 'DEV' ? `${process.env.REACT_APP_TIER2_DEV_LINK}?client_reference_id=${user?.uid}` : `${process.env.REACT_APP_TIER2_PROD_LINK}?client_reference_id=${user?.uid}`}
			target="blank"
			color="btn-secondary"
			text="Subscribe Tier 2"
			icon="tier2"
			size="w-3/4"
		/>
	);
}

export default SubscribeT2Btn;
