import React from 'react';
import { BiComment } from 'react-icons/bi';

/**
 * displays the builds comment count
 * @param {int} commentCount
 * @returns
 */
function BuildCardComments({ commentCount }) {
	return (
		<div className="tooltip" data-tip="Comments">
			<div className="flex flex-row items-center gap-2">
				<p className="text-2xl 2k:text-3xl">
					<BiComment />
				</p>
				<p className="text-lg 2k:text-2xl">{commentCount ? commentCount : 0}</p>
			</div>
		</div>
	);
}

export default BuildCardComments;
