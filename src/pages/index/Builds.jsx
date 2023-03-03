import React, { useContext, useEffect, useState } from 'react';
import BuildCard from '../../components/buildCard/BuildCard';
import BuildsContext from '../../context/builds/BuildsContext';
import Spinner1 from '../../components/spinners/Spinner1';
import LoadMoreBuilds from '../../components/buttons/LoadMoreBuilds';
import Sort from './Sort';
import { cloneDeep } from 'lodash';
import FiltersContext from '../../context/filters/FiltersContext';
import useFilters from '../../context/filters/FiltersActions';

function Builds() {
	const { loadingBuilds, fetchedBuilds, lastFetchedBuild } = useContext(BuildsContext);
	const { typeFilters, versionFilters, searchTerm, tagsSearch, sortBy } = useContext(FiltersContext);
	const [sortedBuilds, setSortedBuilds] = useState([]);
	const { filterBuilds } = useFilters();

	// Listen for changes to the sorting and filter the decks accordingly
	useEffect(() => {
		let newFetchedBuilds = cloneDeep(fetchedBuilds);

		setSortedBuilds(filterBuilds(newFetchedBuilds));
	}, [fetchedBuilds, sortBy, typeFilters, versionFilters, searchTerm, tagsSearch]);

	return (
		<div className="flex flex-wrap col-start-2 col-end-6">
			<div className="sort flex flex-row w-full place-content-end mb-4">
				<Sort />
			</div>
			<div className="flex flex-row flex-wrap gap-4 w-full justify-center mb-6">
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
		</div>
	);
}

export default Builds;
