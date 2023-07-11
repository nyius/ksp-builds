import React from 'react';
import { FiDownload } from 'react-icons/fi';

/**
 * Displays a builds download count
 * @param {int} downloads
 * @returns
 */
function BuildCardDownloads({ downloads }) {
	return (
		<div className="flex flex-row items-center gap-2 text-xl 2k:text-2xl text-slate-400 font-bold">
			<FiDownload /> {downloads} {downloads === 1 ? 'download' : 'downloads'}
		</div>
	);
}

export default BuildCardDownloads;
