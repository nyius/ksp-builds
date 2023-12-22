import React from 'react';
import { useBuildsContext } from '../../../context/builds/BuildsContext';

/**
 * Displays the builds container
 * @param {*} children
 * @returns
 */
function BuildsContainer({ children }) {
	const { buildsView, forcedView } = useBuildsContext();

	return (
		<div className={`${buildsView === 'list' || forcedView === 'pinnedList' ? 'flex flex-col gap-5' : ''} ${buildsView === 'grid' && forcedView !== 'pinnedList' ? 'flex flex-wrap gap-10' : ''} justify-center realtive w-full mb-6`}>
			{children}
		</div>
	);
}

export default BuildsContainer;
