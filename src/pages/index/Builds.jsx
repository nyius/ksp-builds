import React, { useContext, useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';
import { useParams } from 'react-router-dom';
//---------------------------------------------------------------------------------------------------//
import BuildsContext from '../../context/builds/BuildsContext';
import FiltersContext from '../../context/filters/FiltersContext';
import useFilters from '../../context/filters/FiltersActions';
import useBuilds from '../../context/builds/BuildsActions';
//---------------------------------------------------------------------------------------------------//
import Sort from '../../components/sort/Sort';
import LoadMoreBuilds from '../../components/buttons/LoadMoreBuilds';
import Spinner1 from '../../components/spinners/Spinner1';
import BuildCard from '../../components/buildCard/BuildCard';
import SearchBar from '../../components/search/SearchBar';
import CantFind from '../../components/cantFind/CantFind';

function Builds() {
	const { typeFilter, versionFilter, searchTerm, tagsSearch, sortBy } = useContext(FiltersContext);
	const { loadingBuilds, fetchedBuilds, lastFetchedBuild } = useContext(BuildsContext);
	const [sortedBuilds, setSortedBuilds] = useState([]);
	const { filterBuilds, setTypeFilter } = useFilters();
	const { fetchBuilds } = useBuilds();
	const { id } = useParams();

	useEffect(() => {
		if (id) {
			setTypeFilter(id);
		}
	}, [id]);

	// Listen for changes to the sorting and filter the builds accordingly
	useEffect(() => {
		let newFetchedBuilds = cloneDeep(fetchedBuilds);

		setSortedBuilds(filterBuilds(newFetchedBuilds));
	}, [fetchedBuilds, versionFilter, sortBy]);

	// listens for filters and fetches builds based on filter
	useEffect(() => {
		fetchBuilds();
	}, [typeFilter, searchTerm, tagsSearch]);

	if (!loadingBuilds && fetchedBuilds.length === 0) {
		return <CantFind text="No builds found :("></CantFind>;
	}

	//---------------------------------------------------------------------------------------------------//
	return (
		<>
			<div className="flex flex-row gap-4 w-full place-content-between md:place-content-end sm:mb-4">
				<SearchBar />
				<Sort />
			</div>
			<div className="flex flex-wrap md:grid md:grid-cols-3 xl:grid-cols-4 4k:grid-cols-5 gap-4 xl:gap-8 2k:gap-12 w-full items-center justify-center md:justify-items-center mb-6 p-6 md:p-0">
				{loadingBuilds ? (
					<div className="flex flex-row w-full justify-center items-center">
						<div className="w-20">
							<Spinner1 />
						</div>
					</div>
				) : (
					<>
						{sortedBuilds.map((build, i) => {
							return <BuildCard key={i} i={i} build={build} />;
						})}
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
