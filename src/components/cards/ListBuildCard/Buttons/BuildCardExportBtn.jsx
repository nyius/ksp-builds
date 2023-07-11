import React, { useState } from 'react';
import { useCopyBuildToClipboard } from '../../../../context/build/BuildActions';
import { TiExport } from 'react-icons/ti';

/**
 * handles displaying the export build button
 * @param {string} buildId - the id of the build to export
 * @param {bool} hover - hover state (true to show this, false to hide)
 * @returns
 */
function BuildCardExportBtn({ buildId, hover }) {
	const [fetchingRawBuild, setFetchingRawBuild] = useState(false);
	const { copyBuildToClipboard } = useCopyBuildToClipboard();

	return (
		<>
			<div className={`absolute hidden lg:block ${hover ? 'right-60 border-solid border-r-8' : 'right-0'} z-51 top-0 w-60 bg-base-400 rounded-r-lg h-full p-4 transition-all border-zinc-900`}></div>

			<div
				className={`absolute ${
					hover ? 'opacity-1 border-t-8 lg:border-t-0 shadow-lg lg:shadow-none' : 'opacity-0 -bottom-0 lg:bottom-auto'
				} z-50 transition-all left-0 -bottom-10 lg:left-auto lg:bottom-auto lg:right-0 lg:top-0 w-full lg:w-60 bg-primary rounded-b-lg lg:rounded-r-lg lg:h-full p-4 hover:bg-primary-focus border-solid border-zinc-900`}
				onClick={e => {
					e.preventDefault();
					copyBuildToClipboard(setFetchingRawBuild, buildId);
				}}
			>
				<div className="flex flex-row gap-4 lg:gap-0 lg:flex-col items-center justify-center h-full w-full text-xl 2k:text-2xl text-white text-center pixel-font">
					{fetchingRawBuild ? 'Copying...' : 'Export to KSP 2'}{' '}
					<span className=" text-3xl lg:text-2xl 2k:text-3xl">
						<TiExport />
					</span>
				</div>
			</div>
		</>
	);
}

export default BuildCardExportBtn;
