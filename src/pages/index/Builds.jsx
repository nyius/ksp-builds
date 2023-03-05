import React, { useContext, useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';
//---------------------------------------------------------------------------------------------------//
import BuildsContext from '../../context/builds/BuildsContext';
import FiltersContext from '../../context/filters/FiltersContext';
import useFilters from '../../context/filters/FiltersActions';
import useBuilds from '../../context/builds/BuildsActions';
//---------------------------------------------------------------------------------------------------//
import Sort from './Sort';
import LoadMoreBuilds from '../../components/buttons/LoadMoreBuilds';
import Spinner1 from '../../components/spinners/Spinner1';
import BuildCard from '../../components/buildCard/BuildCard';
import SearchBar from '../../components/search/SearchBar';
import Filter from '../../components/filters/Filter';

function Builds() {
	const { typeFilter, versionFilters, searchTerm, tagsSearch, sortBy } = useContext(FiltersContext);
	const { loadingBuilds, fetchedBuilds, lastFetchedBuild } = useContext(BuildsContext);
	const [sortedBuilds, setSortedBuilds] = useState([]);
	const { filterBuilds } = useFilters();
	const { fetchBuilds } = useBuilds();

	// Listen for changes to the sorting and filter the builds accordingly
	useEffect(() => {
		let newFetchedBuilds = cloneDeep(fetchedBuilds);

		setSortedBuilds(filterBuilds(newFetchedBuilds));
	}, [fetchedBuilds, sortBy]);

	// listens for filters and fetches builds based on filter
	useEffect(() => {
		fetchBuilds();
	}, [typeFilter, versionFilters, searchTerm, tagsSearch]);

	//---------------------------------------------------------------------------------------------------//
	return (
		<>
			<div className="flex flex-row gap-4 w-full place-content-between md:place-content-end sm:mb-4">
				<Filter />
				<SearchBar />
				<Sort />
			</div>
			<div className="flex flex-wrap md:grid md:grid-cols-3 2k:grid-cols-4 gap-4 w-full items-center justify-center md:justify-items-center mb-6 p-6 md:p-0">
				{loadingBuilds ? (
					<div className="flex flex-row w-full justify-center items-center">
						<div className="w-20">
							<Spinner1 />
						</div>
					</div>
				) : (
					<>
						{fetchedBuilds.length === 0 ? (
							<div className="flex flex-row w-full justify-center items-center">
								<p>No builds found :(</p>
							</div>
						) : (
							<>
								{sortedBuilds.map((build, i) => {
									return <BuildCard key={i} i={i} build={build} />;
								})}
							</>
						)}
					</>
				)}
			</div>

			{!loadingBuilds && lastFetchedBuild !== 'end' && (
				<div className="flex flex-row w-full justify-center items-center">
					<LoadMoreBuilds />
				</div>
			)}
		</>
	);
}

export default Builds;
