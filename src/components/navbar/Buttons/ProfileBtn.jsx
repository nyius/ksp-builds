import React from 'react';
import Button from '../../buttons/Button';

/**
 * Displays the Profile button
 * @returns
 */
function ProfileBtn() {
	return <Button type="ahref" href="/profile" size="w-full" color="btn-ghost" css="border-2 border-solid border-slate-500 space-between" icon="head" text="Profile" />;
}

export default ProfileBtn;
