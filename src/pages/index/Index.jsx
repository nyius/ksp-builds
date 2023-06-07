import React, { useEffect, useContext } from 'react';
import { Helmet } from 'react-helmet';
//---------------------------------------------------------------------------------------------------//
import useBuilds from '../../context/builds/BuildsActions';
import FiltersContext from '../../context/filters/FiltersContext';
import BuildsContext from '../../context/builds/BuildsContext';
//---------------------------------------------------------------------------------------------------//
import Builds from '../../components/builds/Builds';
import Banner from '../../components/banner/Banner';
import FetchAmount from '../../components/fetchAmount/FetchAmount';
import SearchBar from '../../components/search/SearchBar';
import Sort from '../../components/sort/Sort';
//---------------------------------------------------------------------------------------------------//
import useResetStates from '../../utilities/useResetStates';
//---------------------------------------------------------------------------------------------------//

function Index() {
	const { fetchBuilds } = useBuilds();

	const { resetStates } = useResetStates();

	useEffect(() => {
		resetStates();
	}, []);

	const { typeFilter, versionFilter, searchTerm, sortBy, modsFilter, challengeFilter } = useContext(FiltersContext);
	const { fetchAmount } = useContext(BuildsContext);

	// listens for filters and fetches builds based on filter
	useEffect(() => {
		fetchBuilds();
	}, [typeFilter, searchTerm, modsFilter, versionFilter, challengeFilter, sortBy, fetchAmount]);

	//---------------------------------------------------------------------------------------------------//
	return (
		<>
			<Helmet>
				<meta charSet="utf-8" />
				<title>KSP Builds - Home</title>
				<link rel="canonical" href={`https://kspbuilds.com`} />
			</Helmet>

			<Banner />

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
