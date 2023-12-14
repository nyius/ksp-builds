import React, { useState } from 'react';
import { useCopyBuildToClipboard } from '../../context/build/BuildActions';
import Button from './Button';
import { TiExport } from 'react-icons/ti';

/**
 * Button for exporting a build (copying it to the users clipboard)
 * @param {string} id - takes in the ID of the build to copy to the clipboard
 * @returns
 */
function ExportBuildBtn({ build, hover }) {
	const { copyBuildToClipboard } = useCopyBuildToClipboard();
	const [fetchingRawBuild, setFetchingRawBuild] = useState(false);

	return (
		<div
			className={`bg-primary ${hover === build.urlName ? 'absolute' : 'hidden'} bottom-0 hover:bg-primary-focus w-full flex flex-row gap-4 h-12 2k:h-14 mb-0 items-center justify-center p-2 text-white text-2xl rounded-b-xl font-bold"`}
			onClick={e => {
				e.preventDefault();
				copyBuildToClipboard(setFetchingRawBuild, build.id);
			}}
		>
			<TiExport />
			{fetchingRawBuild ? 'Copying...' : `Export to KSP 2`}
		</div>
	);
}

export default ExportBuildBtn;
