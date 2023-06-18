import React from 'react';
import Button from '../../buttons/Button';

/**
 * Displays the settings button
 * @returns
 */
function SettingsBtn() {
	return <Button type="ahref" href="/settings" size="w-full" color="btn-ghost" css="border-2 border-solid border-slate-500 space-between" icon="settings" text="Settings" />;
}

export default SettingsBtn;
