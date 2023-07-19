import React from 'react';
import { useFetchBuilds } from '../../context/builds/BuildsActions';
//---------------------------------------------------------------------------------------------------//
import Builds from '../../components/builds/Builds';
import Hero from '../../components/hero/Hero';
import FetchAmount from '../../components/fetchAmount/FetchAmount';
import SearchBar from '../../components/search/SearchBar';
import Sort from '../../components/sort/Sort';
import Helmet from '../../components/Helmet/Helmet';
//---------------------------------------------------------------------------------------------------//
import useResetStates from '../../hooks/useResetStates';
import BuildsViewBtn from '../../components/buttons/BuildsViewBtn';
//---------------------------------------------------------------------------------------------------//

/**
 * Index page
 * @returns
 */
function Index() {
	useResetStates();
	useFetchBuilds();

	//---------------------------------------------------------------------------------------------------//
	return (
		<>
			<Helmet title="Home" pageLink="https://kspbuilds.com" />

			<Hero />

			<div className="flex flex-row flex-wrap gap-4 w-full place-content-end sm:mb-4">
				<SearchBar />
				<Sort />
				<FetchAmount />
				<BuildsViewBtn />
			</div>
			<Builds />
		</>
	);
}

export default Index;
