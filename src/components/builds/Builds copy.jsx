import React, { useContext, useEffect, useState } from 'react';
//---------------------------------------------------------------------------------------------------//
import BuildsContext from '../../context/builds/BuildsContext';
import FiltersContext from '../../context/filters/FiltersContext';
import useBuilds from '../../context/builds/BuildsActions';
//---------------------------------------------------------------------------------------------------//
import Sort from '../sort/Sort';
import Spinner1 from '../spinners/Spinner1';
import BuildCard from '../cards/BuildCard';
import SearchBar from '../search/SearchBar';
import CantFind from '../cantFind/CantFind';
import Banner from '../banner/Banner';
import FetchAmount from '../fetchAmount/FetchAmount';

function Builds() {
	const { typeFilter, versionFilter, searchTerm, sortBy, modsFilter, challengeFilter } = useContext(FiltersContext);
	const { loadingBuilds, fetchedBuilds, currentPage, fetchAmount } = useContext(BuildsContext);
	const { fetchBuilds, fetchMoreBuilds, setCurrentPage, goBackPage } = useBuilds();

	useEffect(() => {
		setCurrentPage(0);
	}, []);

	// listens for filters and fetches builds based on filter
	useEffect(() => {
		fetchBuilds();
	}, [typeFilter, searchTerm, modsFilter, versionFilter, challengeFilter, sortBy, fetchAmount]);

	//---------------------------------------------------------------------------------------------------//
	return (
		<>
			<Banner />
			<div className="flex flex-row flex-wrap gap-4 w-full place-content-end sm:mb-4">
				<SearchBar />
				<Sort />
				<FetchAmount />
			</div>
			{!loadingBuilds && fetchedBuilds.length === 0 ? (
				<>
					<div className="flex flex-row flex-wrap gap-4 w-full place-content-end sm:mb-4">
						<CantFind text="No builds found :("></CantFind>
					</div>
				</>
			) : (
				<>
					<div className="flex flex-row flex-wrap w-full items-stretch justify-center md:justify-items-center mb-6 p-6 md:p-0">
						{loadingBuilds ? (
							<div className="flex flex-row w-full justify-center items-center">
								<div className="w-20">
									<Spinner1 />
								</div>
							</div>
						) : (
							<>
								{fetchedBuilds.map((build, i) => {
									return <BuildCard key={build.id} i={i} build={build} />;
								})}
							</>
						)}
					</div>

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
