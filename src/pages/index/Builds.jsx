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
import Spinner1 from '../../components/spinners/Spinner1';
import BuildCard from '../../components/buildCard/BuildCard';
import SearchBar from '../../components/search/SearchBar';
import CantFind from '../../components/cantFind/CantFind';
import Button from '../../components/buttons/Button';
import Banner from '../../components/banner/Banner';

function Builds() {
	const { typeFilter, versionFilter, searchTerm, tagsSearch, sortBy, modsFilter } = useContext(FiltersContext);
	const { loadingBuilds, fetchedBuilds, lastFetchedBuild, currentPage } = useContext(BuildsContext);
	const [sortedBuilds, setSortedBuilds] = useState([]);
	const { filterBuilds, setTypeFilter, resetFilters } = useFilters();
	const { fetchBuilds, fetchMoreBuilds, setCurrentPage, goBackPage } = useBuilds();
	const { id } = useParams();

	useEffect(() => {
		if (id) {
			setTypeFilter(id);
		}
		if (!id) {
			resetFilters();
		}
	}, [id]);

	useEffect(() => {
		setCurrentPage(0);
	}, []);

	// Listen for changes to the sorting and filter the builds accordingly
	useEffect(() => {
		let newFetchedBuilds = cloneDeep(fetchedBuilds);

		setSortedBuilds(filterBuilds(newFetchedBuilds));
	}, [fetchedBuilds, versionFilter, sortBy, modsFilter]);

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
			<Banner />
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

			<div className="flex flex-row w-full justify-center items-center gap-2 2k:gap-4">
				{!loadingBuilds && currentPage > 0 && <Button icon="left" onClick={() => goBackPage(currentPage - 1)} color="bg-base-900 text-white" text="Prev" />}
				{!loadingBuilds && fetchedBuilds.length == process.env.REACT_APP_BUILDS_FETCH_NUM && <Button icon="right" onClick={() => fetchMoreBuilds(process.env.REACT_APP_BUILDS_FETCH_NUM)} color="bg-base-900 text-white" text="Next" />}
			</div>
		</>
	);
}

export default Builds;
