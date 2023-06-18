import React from 'react';
import CheckCredentials from '../../credentials/CheckCredentials';
import Button from '../../buttons/Button';

/**
 * Displays the admin panel button
 * @returns
 */
function AdminPanelBtn() {
	return (
		<CheckCredentials type="admin">
			<Button type="ahref" size="w-full" href="/admin-panel" color="btn-ghost" css="border-2 border-solid border-slate-500 space-between" icon="settings" text="Admin Panel" />
		</CheckCredentials>
	);
}

export default AdminPanelBtn;
