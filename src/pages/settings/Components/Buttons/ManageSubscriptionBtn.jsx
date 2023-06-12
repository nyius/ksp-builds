import React from 'react';
import Button from '../../../../components/buttons/Button';

/**
 * Manage Sub Button
 * @returns
 */
function ManageSubscriptionBtn() {
	return (
		<Button
			type="ahref"
			href={process.env.REACT_APP_ENV === 'DEV' ? process.env.REACT_APP_MANAGE_SUBSCRIPTION_DEV : process.env.REACT_APP_MANAGE_SUBSCRIPTION_PROD}
			target="blank"
			color="btn-accent"
			text="Manage Subscription"
			icon="head"
			size="w-fit"
		/>
	);
}

export default ManageSubscriptionBtn;
