import React from 'react';
import { AiFillEye } from 'react-icons/ai';

/**
 * Displays the builds views
 * @param {int} views
 * @returns
 */
function BuildCardViews({ views }) {
	return (
		<div className="flex flex-row items-center gap-2 text-lg 2k:text-xl text-slate-400 font-bold">
			<AiFillEye /> {views}
		</div>
	);
}

export default BuildCardViews;
