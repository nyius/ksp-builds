import React, { useContext, useState, useEffect } from 'react';
import FoldersContext from '../../../context/folders/FoldersContext';
import Builds from '../../../components/builds/Builds';
import Folders from '../../../components/folders/Folders';
import { cloneDeep } from 'lodash';
import BuildsContext from '../../../context/builds/BuildsContext';
import useFilters from '../../../context/filters/FiltersActions';
import FiltersContext from '../../../context/filters/FiltersContext';

/**
 * Displays the users folders
 * @returns
 */
function UploadBuildFolders() {
	const { openedFolder } = useContext(FoldersContext);
	const { fetchedBuilds } = useContext(BuildsContext);
	const { sortBy } = useContext(FiltersContext);
	const [sortedBuilds, setSortedBuilds] = useState(null);
	const { filterBuilds } = useFilters();

	// Listen for changes to the sorting and filter the builds accordingly
	useEffect(() => {
		let newFetchedBuilds = cloneDeep(fetchedBuilds);

		setSortedBuilds(filterBuilds(newFetchedBuilds));
	}, [fetchedBuilds, sortBy]);

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className="flex flex-col w-full gap-2 2k:gap-4">
			<div className="flex flex-row gap-4 items-center mb-2 2k:mb-4 mt-8 2k:mt-18">
				<h3 className="text-slate-200 text-xl 2k:text-3xl">Save to Folder</h3>
			</div>
			<Folders />

			{openedFolder ? <Builds buildsToDisplay={sortedBuilds} /> : null}
		</div>
	);
}

export default UploadBuildFolders;
