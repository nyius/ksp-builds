import React from 'react';
import { AiFillEye } from 'react-icons/ai';

/**
 * Displays the builds views
 * @param {int} views
 * @returns
 */
function BuildCardViews({ views }) {
	return (
		<div className="flex flex-row items-center gap-2 text-xl 2k:text-2xl text-slate-400">
			<AiFillEye /> {views} views
		</div>
	);
}

export default BuildCardViews;
