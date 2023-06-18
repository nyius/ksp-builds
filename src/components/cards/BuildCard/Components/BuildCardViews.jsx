import React from 'react';
import { AiFillEye } from 'react-icons/ai';

/**
 * Displays the builds view
 * @param {int} views
 * @returns
 */
function BuildCardViews({ views }) {
	return (
		<p className="flex flex-row gap-2 p-4 text-white badge absolute bottom-1 right-1 text-lg 2k:text-xl">
			<span className="view-count">
				<AiFillEye />
			</span>
			{views}
		</p>
	);
}

export default BuildCardViews;
