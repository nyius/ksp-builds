import React from 'react';
import Button from './Button';
import { useBuildsContext } from '../../context/builds/BuildsContext';
import { setBuildsView } from '../../context/builds/BuildsActions';
import { setLocalStoredBuildsView } from '../../context/builds/BuildsUtils';

/**
 * Button for changing the view of the builds list
 * @returns
 */
function BuildsViewBtn() {
	const { buildsView, dispatchBuilds } = useBuildsContext();

	if (buildsView === 'list') {
		return (
			<Button
				tooltip="Change to Grid View"
				color={`bg-base-900 ${buildsView === 'grid' ? 'text-white' : ''}`}
				icon="grid"
				onClick={() => {
					setBuildsView(dispatchBuilds, 'grid');
					setLocalStoredBuildsView('grid');
				}}
			/>
		);
	} else if (buildsView === 'grid') {
		return (
			<Button
				tooltip="Change to List View"
				color={`bg-base-900 ${buildsView === 'list' ? 'text-white' : ''}`}
				icon="list"
				onClick={() => {
					setBuildsView(dispatchBuilds, 'list');
					setLocalStoredBuildsView('list');
				}}
			/>
		);
	}
}

export default BuildsViewBtn;
