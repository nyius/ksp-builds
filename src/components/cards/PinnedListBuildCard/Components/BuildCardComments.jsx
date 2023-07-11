import React from 'react';
import { BiComment } from 'react-icons/bi';

/**
 * Displays a builds comment count
 * @param {int} commentCount
 * @returns
 */
function BuildCardComments({ commentCount }) {
	return (
		<div className="flex flex-row items-center gap-2 text-lg 2k:text-xl text-slate-400 font-bold">
			<BiComment /> {commentCount}
		</div>
	);
}

export default BuildCardComments;
