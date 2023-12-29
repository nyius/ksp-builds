import React from 'react';
import { useBuildContext } from '../../../context/build/BuildContext';
import Builds from '../../../components/builds/Builds';
import { useSetBuildsForcedView } from '../../../context/builds/BuildsActions';
import PlanetHeader from '../../../components/header/PlanetHeader';
import { useFetchPinnedHangar, useSetPinnedHangar } from '../../../context/hangars/HangarActions';

/**
 * Displays a builds pinned hangar if it has one set
 * @returns
 */
function BuildPinnedHangar() {
	const { loadingBuild, loadedBuild } = useBuildContext();
	const [fetchedHangar] = useFetchPinnedHangar(null);

	useSetBuildsForcedView('pinnedList');
	useSetPinnedHangar();

	if (!loadingBuild && loadedBuild?.pinnedHangar && fetchedHangar) {
		return (
			<div className="bg-base-900 rounded-lg w-full lg:max-w-lg 2k:max-w-3xl h-[30rem] lg:h-full px-4 py-6 2k:py-8 2k:px-6 overflow-auto scrollbar">
				<PlanetHeader css="!text-xl 2k:!text-2xl" text={fetchedHangar.hangarName} />

				<Builds />
			</div>
		);
	}
}

export default BuildPinnedHangar;
