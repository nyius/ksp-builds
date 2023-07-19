import React from 'react';
import { useAuthContext } from '../../../../context/auth/AuthContext';
import Button from '../../../../components/buttons/Button';

/**
 * Tier 1 sub button
 * @returns
 */
function SubscribeT1Btn() {
	const { user } = useAuthContext();

	return (
		<Button
			type="ahref"
			href={process.env.REACT_APP_ENV === 'DEV' ? `${process.env.REACT_APP_TIER1_DEV_LINK}?client_reference_id=${user?.uid}` : `${process.env.REACT_APP_TIER1_PROD_LINK}?client_reference_id=${user?.uid}`}
			target="blank"
			color="btn-primary"
			text="Subscribe Tier 1"
			icon="tier1"
			size="w-3/4"
		/>
	);
}

export default SubscribeT1Btn;
