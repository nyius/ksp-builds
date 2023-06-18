import React from 'react';
import { FiDownload } from 'react-icons/fi';

/**
 * Displays a bilds download count
 * @param {int} downloads
 * @returns
 */
function BuildCardDownloads({ downloads }) {
	return (
		<div className="tooltip" data-tip="Downloads">
			<div className="flex flex-row items-center gap-2">
				<p className="text-2xl 2k:text-3xl">
					<FiDownload />
				</p>
				<p className="text-lg 2k:text-2xl">{downloads}</p>
			</div>
		</div>
	);
}

export default BuildCardDownloads;
