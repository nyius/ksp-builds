import React, { useContext, useEffect, useState } from 'react';
//---------------------------------------------------------------------------------------------------//
import BuildsContext from '../../context/builds/BuildsContext';
import useBuilds, { setCurrentPage, useChangePage } from '../../context/builds/BuildsActions';
import FoldersContext from '../../context/folders/FoldersContext';
//---------------------------------------------------------------------------------------------------//
import Spinner1 from '../spinners/Spinner1';
import BuildCard from '../cards/BuildCard';
import CantFind from '../cantFind/CantFind';

/**
 * Displays a list of fetched builds
 * @param {arr} buildsToDisplay - takes in an optional array of builds to display
 * @returns
 */
function Builds({ buildsToDisplay }) {
	const { dispatchBuilds, loadingBuilds, fetchedBuilds, currentPage, fetchAmount } = useContext(BuildsContext);
	const { openedFolder } = useContext(FoldersContext);
	const { fetchMoreBuilds, fetchBuildsById } = useBuilds();
	const { goBackPage } = useChangePage();

	useEffect(() => {
		setCurrentPage(dispatchBuilds, 0);
	}, []);

	useEffect(() => {
		if (openedFolder) {
			fetchBuildsById(openedFolder.builds, null, 'public');
		}
	}, [openedFolder]);

	//---------------------------------------------------------------------------------------------------//
	return (
		<>
			{!loadingBuilds && fetchedBuilds.length === 0 ? (
				<>
					<div className="flex flex-row flex-wrap gap-4 w-full place-content-end sm:mb-4">
						<CantFind text="No builds found :("></CantFind>
					</div>
				</>
			) : (
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

					{/* Prev/Next Page Buttons */}
					<div className="btn-group w-full justify-center items-center">
						{!loadingBuilds && currentPage > 0 && (
							<button
								className="btn btn-lg text-xl 2k:text-2xl"
								onClick={() => {
									window.scrollTo(0, 0);
									goBackPage(currentPage - 1);
								}}
							>
								«
							</button>
						)}
						<button className="btn btn-lg text-xl 2k:text-2xl">Page {currentPage + 1}</button>
						{!loadingBuilds && fetchedBuilds.length == fetchAmount && (
							<button
								className="btn btn-lg text-xl 2k:text-2xl"
								onClick={() => {
									window.scrollTo(0, 0);
									fetchMoreBuilds(fetchAmount);
								}}
							>
								»
							</button>
						)}
					</div>
				</>
			)}
		</>
	);
}

export default Builds;
