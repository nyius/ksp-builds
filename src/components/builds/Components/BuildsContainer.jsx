import React, { useContext } from 'react';
import BuildsContext from '../../../context/builds/BuildsContext';

/**
 * Displays the builds container
 * @param {*} children
 * @returns
 */
function BuildsContainer({ children }) {
	const { buildsView, forcedView } = useContext(BuildsContext);

	return (
		<div
			className={`${buildsView === 'list' || forcedView === 'pinnedList' ? 'flex flex-col gap-4 2k:gap-5' : ''} ${
				buildsView === 'grid' && forcedView !== 'pinnedList' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2k:grid-cols-5 4k:grid-cols-6 5k:grid-cols-7 gap-4 xl:gap-6 2k:gap-8' : ''
			} realtive w-full items-stretch justify-center md:justify-items-center mb-6 p-6 md:p-0`}
		>
			{children}
		</div>
	);
}

export default BuildsContainer;
