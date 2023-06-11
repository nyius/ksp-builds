import React from 'react';
import { toast } from 'react-toastify';
import Button from '../../../../components/buttons/Button';

/**
 * Buttun for sharing the URL currently loaded build page
 * @returns
 */
function ShareBuildBtn() {
	/**
	 * Handles copying the URL to clipboard for sharing
	 */
	const handleShareBuild = () => {
		let url = document.location.href;
		navigator.clipboard.writeText(url);
		toast.success('Copied URL to clipboard!');
	};

	return <Button tooltip="Share" color="btn-ghost text-accent" icon="share" onClick={handleShareBuild} />;
}

export default ShareBuildBtn;
