import React from 'react';
import { useBuildContext } from '../../../context/build/BuildContext';
import Builds from '../../../components/builds/Builds';
import { useSetBuildsForcedView } from '../../../context/builds/BuildsActions';
import PlanetHeader from '../../../components/header/PlanetHeader';
import { useFetchPinnedFolder, useSetPinnedFolder } from '../../../context/folders/FoldersActions';

/**
 * Displays a builds pinned folder if it has one set
 * @returns
 */
function BuildPinnedFolder() {
	const { loadingBuild, loadedBuild } = useBuildContext();
	const [fetchedFolder] = useFetchPinnedFolder(null);

	useSetBuildsForcedView('pinnedList');
	useSetPinnedFolder();

	if (!loadingBuild && loadedBuild?.pinnedFolder && fetchedFolder) {
		return (
			<div className="bg-base-900 rounded-lg w-full h-58rem 2k:h-70rem px-4 py-6 2k:py-8 2k:px-6 overflow-auto scrollbar">
				<PlanetHeader css="!text-xl 2k:!text-2xl" text={fetchedFolder.folderName} />

				<Builds />
			</div>
		);
	}
}

export default BuildPinnedFolder;
