import React from 'react';
import Button from '../../../../components/buttons/Button';

/**
 * Button for how to import the build into KSP
 * @returns
 */
function HowToImportBtn() {
	return <Button tooltip="How to import into KSP" color="btn-info" htmlFor="how-to-paste-build-modal" icon="info" />;
}

export default HowToImportBtn;
