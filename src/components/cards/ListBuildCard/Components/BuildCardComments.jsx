import React from 'react';
import { BiComment } from 'react-icons/bi';

/**
 * Displays a builds comment count
 * @param {int} commentCount
 * @returns
 */
function BuildCardComments({ commentCount }) {
	return (
		<div className="flex flex-row items-center gap-2 text-xl 2k:text-2xl text-slate-400">
			<BiComment /> {commentCount} comments
		</div>
	);
}

export default BuildCardComments;
