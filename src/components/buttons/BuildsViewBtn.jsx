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
				color={`bg-base-200 !border-slate-700 !border-1 !border-solid ${buildsView === 'grid' ? 'text-white' : ''}`}
				css="hover:text-slate-100"
				icon="grid"
				size="!h-16"
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
				color={`bg-base-200 !border-slate-700 !border-1 !border-solid ${buildsView === 'list' ? 'text-white' : ''}`}
				css="hover:text-slate-100"
				icon="list"
				size="!h-16"
				onClick={() => {
					setBuildsView(dispatchBuilds, 'list');
					setLocalStoredBuildsView('list');
				}}
			/>
		);
	}
}

export default BuildsViewBtn;
