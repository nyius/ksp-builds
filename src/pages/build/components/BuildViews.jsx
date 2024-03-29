import React from 'react';
import { useBuildContext } from '../../../context/build/BuildContext';
import { AiFillEye } from 'react-icons/ai';

/**
 * Displays a builds view count
 * @returns
 */
function BuildViews() {
	const { loadedBuild } = useBuildContext();

	return (
		<p className="flex flex-row text-2xl items-center gap-2 2k:text-4xl">
			<AiFillEye />
			<span className="text-lg 2k:text-3xl">{loadedBuild.views}</span>
		</p>
	);
}

export default BuildViews;
