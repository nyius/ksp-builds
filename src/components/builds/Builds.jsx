import React, { useContext, useEffect } from 'react';
//---------------------------------------------------------------------------------------------------//
import BuildsContext from '../../context/builds/BuildsContext';
import useBuilds, { setCurrentPage } from '../../context/builds/BuildsActions';
import FoldersContext from '../../context/folders/FoldersContext';
//---------------------------------------------------------------------------------------------------//
import Spinner1 from '../spinners/Spinner1';
import BuildCard from '../cards/BuildCard/BuildCard';
import CantFind from '../cantFind/CantFind';
import PrevPageBtn from './Buttons/PrevPageBtn';
import NextPageBtn from './Buttons/NextPageBtn';

/**
 * Displays a list of fetched builds
 * @param {arr} buildsToDisplay - takes in an optional array of builds to display
 * @returns
 */
function Builds({ buildsToDisplay }) {
	const { dispatchBuilds, loadingBuilds, fetchedBuilds, currentPage } = useContext(BuildsContext);
	const { openedFolder } = useContext(FoldersContext);
	const { fetchBuildsById } = useBuilds();

	useEffect(() => {
		setCurrentPage(dispatchBuilds, 0);
	}, []);

	useEffect(() => {
		if (openedFolder) {
			fetchBuildsById(openedFolder.builds, null, 'public');
		}
	}, [openedFolder]);

	//---------------------------------------------------------------------------------------------------//
	if (!loadingBuilds && fetchedBuilds.length === 0) {
		return (
			<div className="flex flex-row flex-wrap gap-4 w-full place-content-end sm:mb-4">
				<CantFind text="No builds found :("></CantFind>
			</div>
		);
	}

	return (
		<>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2k:grid-cols-5 4k:grid-cols-6 5k:grid-cols-7 gap-4 xl:gap-6 2k:gap-8 realtive w-full items-stretch justify-center md:justify-items-center mb-6 p-6 md:p-0">
				{loadingBuilds ? (
					<div className="flex flex-row w-full justify-center items-center">
						<div className="w-20">
							<Spinner1 />
						</div>
					</div>
				) : (
					<>
						{buildsToDisplay ? (
							<>
								{buildsToDisplay.map((build, i) => {
									return <BuildCard key={build.id} i={i} build={build} />;
								})}
							</>
						) : (
							<>
								{fetchedBuilds.map((build, i) => {
									return <BuildCard key={build.id} i={i} build={build} />;
								})}
							</>
						)}
					</>
				)}
			</div>

			<div className="btn-group w-full justify-center items-center">
				<PrevPageBtn />
				<button className="btn btn-lg text-xl 2k:text-2xl">Page {currentPage + 1}</button>
				<NextPageBtn />
			</div>
		</>
	);
}

export default Builds;
