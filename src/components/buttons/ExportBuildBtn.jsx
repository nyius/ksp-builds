import React, { useContext, useState } from 'react';
import { useCopyBuildToClipboard } from '../../context/build/BuildActions';
import Button from './Button';

/**
 * Button for exporting a build (copying it to the users clipboard)
 * @param {string} id - takes in the ID of the build to copy to the clipboard
 * @returns
 */
function ExportBuildBtn({ id }) {
	const { copyBuildToClipboard } = useCopyBuildToClipboard();
	const [fetchingRawBuild, setFetchingRawBuild] = useState(false);

	return (
		<Button
			color="btn-primary"
			icon="export"
			onClick={e => {
				e.preventDefault();
				copyBuildToClipboard(setFetchingRawBuild, id);
			}}
			text={fetchingRawBuild ? 'Copying...' : `Export to KSP 2`}
		/>
	);
}

export default ExportBuildBtn;
