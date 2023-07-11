import React from 'react';
import { FiDownload } from 'react-icons/fi';

/**
 * Displays a builds download count
 * @param {int} downloads
 * @returns
 */
function BuildCardDownloads({ downloads }) {
	return (
		<div className="flex flex-row items-center gap-2 text-lg 2k:text-xl text-slate-400 font-bold">
			<FiDownload /> {downloads}
		</div>
	);
}

export default BuildCardDownloads;
