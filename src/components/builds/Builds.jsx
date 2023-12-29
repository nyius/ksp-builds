import React, { Fragment } from 'react';
//---------------------------------------------------------------------------------------------------//
import { useBuildsContext } from '../../context/builds/BuildsContext';
import { useFetchOpenHangarBuilds, useLoadedBuilds, useSetCurrentPage } from '../../context/builds/BuildsActions';
//---------------------------------------------------------------------------------------------------//
import Spinner2 from '../spinners/Spinner2';
import BuildCard from '../cards/BuildCard/BuildCard';
import CantFind from '../cantFind/CantFind';
import PrevPageBtn from './Buttons/PrevPageBtn';
import NextPageBtn from './Buttons/NextPageBtn';
import BuildsContainer from './Components/BuildsContainer';
import ListBuildCard from '../cards/ListBuildCard/ListBuildCard';
import PinnedListBuildCard from '../cards/PinnedListBuildCard/PinnedListBuildCard';

/**
 * Displays a list of fetched builds
 * @param {arr} buildsToDisplay - (optional) takes in an array of builds to display
 * @returns
 */
function Builds({ buildsToDisplay }) {
	const { loadingBuilds, currentPage, buildsView, forcedView } = useBuildsContext();

	const [builds] = useLoadedBuilds([], buildsToDisplay);

	useSetCurrentPage(0);
	useFetchOpenHangarBuilds();

	//---------------------------------------------------------------------------------------------------//
	if (loadingBuilds) {
		return (
			<BuildsContainer>
				<div className="flex flex-row w-full justify-center items-center">
					<div className="w-20">
						<Spinner2 />
					</div>
				</div>
			</BuildsContainer>
		);
	}

	if (!loadingBuilds && builds.length === 0) {
		return (
			<div className="flex flex-row flex-wrap gap-4 w-full place-content-end sm:mb-4">
				<CantFind text="No builds found :("></CantFind>
			</div>
		);
	}

	return (
		<>
			<BuildsContainer>
				{builds.map(build => {
					return (
						<Fragment key={build.id}>{buildsView === 'grid' && forcedView !== 'pinnedList' ? <BuildCard build={build} /> : forcedView === 'pinnedList' ? <PinnedListBuildCard build={build} /> : <ListBuildCard build={build} />}</Fragment>
					);
				})}
			</BuildsContainer>

			<div className="btn-group w-full justify-center items-center">
				<PrevPageBtn />
				<button className="btn btn-lg text-xl 2k:text-2xl">Page {currentPage + 1}</button>
				<NextPageBtn />
			</div>
		</>
	);
}

export default Builds;
