import React from 'react';
import CheckCredentials from '../../credentials/CheckCredentials';
import Button from '../../buttons/Button';

/**
 * Displays the admin panel button
 * @returns
 */
function AccoladeDashboardBtn() {
	return (
		<CheckCredentials type="moderator">
			<Button type="ahref" size="w-full" href="/accolade-dashboard" color="btn-ghost" css="border-2 border-solid border-slate-500 space-between" icon="trophy" text="Accolades" />
		</CheckCredentials>
	);
}

export default AccoladeDashboardBtn;
