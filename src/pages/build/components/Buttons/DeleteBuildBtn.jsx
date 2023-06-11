import React from 'react';
import Button from '../../../../components/buttons/Button';

/**
 * Button for deleting a build
 * @returns
 */
function DeleteBuildBtn() {
	return <Button htmlFor="delete-build-modal" color="btn-error" icon="delete" tooltip="Delete Build" />;
}

export default DeleteBuildBtn;
