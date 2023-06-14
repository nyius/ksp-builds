import React, { useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import algoliasearch from 'algoliasearch/lite';
//---------------------------------------------------------------------------------------------------//
import useBuilds from '../../context/builds/BuildsActions';
import FiltersContext from '../../context/filters/FiltersContext';
import BuildsContext from '../../context/builds/BuildsContext';
//---------------------------------------------------------------------------------------------------//
import Builds from '../../components/builds/Builds';
import Hero from '../../components/hero/Hero';
import FetchAmount from '../../components/fetchAmount/FetchAmount';
import SearchBar from '../../components/search/SearchBar';
import Sort from '../../components/sort/Sort';
import Helmet from '../../components/Helmet/Helmet';
//---------------------------------------------------------------------------------------------------//
import useResetStates from '../../utilities/useResetStates';
//---------------------------------------------------------------------------------------------------//

/**
 * Index page
 * @returns
 */
function Index() {
	const { fetchBuilds, fetchBuildsById } = useBuilds();
	const [searchParams] = useSearchParams();
	const searchClient = algoliasearch('ASOR7A703R', process.env.REACT_APP_ALGOLIA_KEY);
	const index = searchClient.initIndex('builds');

	const { resetStates } = useResetStates();
	const { typeFilter, versionFilter, sortBy, modsFilter, challengeFilter } = useContext(FiltersContext);
	const { fetchAmount } = useContext(BuildsContext);

	useEffect(() => {
		resetStates();
	}, []);

	// listens for filters and fetches builds based on filter
	useEffect(() => {
		const searchQuery = searchParams.get('search_query');

		if (searchQuery) {
			index.search(searchQuery).then(({ hits }) => {
				let ids = [];

				hits.map(hit => {
					ids.push(hit.objectID);
				});

				fetchBuildsById(ids, null, 'public');
			});
		} else {
			fetchBuilds();
		}
	}, [typeFilter, searchParams, modsFilter, versionFilter, challengeFilter, sortBy, fetchAmount]);

	//---------------------------------------------------------------------------------------------------//
	return (
		<>
			<Helmet title="Home" pageLink="https://kspbuilds.com" />

			<Hero />

			<div className="flex flex-row flex-wrap gap-4 w-full place-content-end sm:mb-4">
				<SearchBar />
				<Sort />
				<FetchAmount />
			</div>
			<Builds />
		</>
	);
}

export default Index;
