import React from 'react';
import Button from '../../buttons/Button';

/**
 * Displays the 'how to upload' button
 * @returns
 */
function HowToUploadBtn() {
	return <Button text="How to upload" icon="info" color="text-white" css="hidden lg:flex" htmlFor="how-to-copy-build-modal" />;
}

export default HowToUploadBtn;
