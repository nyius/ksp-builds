import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cloneDeep } from 'lodash';
//---------------------------------------------------------------------------------------------------//
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';
import PlanetHeader from '../../components/header/PlanetHeader';
import Sort from '../../components/sort/Sort';
import Spinner1 from '../../components/spinners/Spinner1';
import CantFind from '../../components/cantFind/CantFind';
import Button from '../../components/buttons/Button';
import BuildCard from '../../components/buildCard/BuildCard';
//---------------------------------------------------------------------------------------------------//
import useResetStates from '../../utilities/useResetStates';
//---------------------------------------------------------------------------------------------------//
import useFilters from '../../context/filters/FiltersActions';
import useBuilds from '../../context/builds/BuildsActions';
import BuildsContext from '../../context/builds/BuildsContext';
import FiltersContext from '../../context/filters/FiltersContext';
import AuthContext from '../../context/auth/AuthContext';

/**
 * Handles displaying users favorites
 * @returns
 */
function Favorites() {
	const [sortedBuilds, setSortedBuilds] = useState([]);
	//---------------------------------------------------------------------------------------------------//
	const { fetchedBuilds, loadingBuilds } = useContext(BuildsContext);
	const { authLoading, user } = useContext(AuthContext);
	const { sortBy } = useContext(FiltersContext);
	//---------------------------------------------------------------------------------------------------//
	const { fetchBuilds, setBuildsLoading, clearFetchedBuilds } = useBuilds();
	const { filterBuilds, resetFilters } = useFilters();
	const { resetStates } = useResetStates();
	//---------------------------------------------------------------------------------------------------//
	const navigate = useNavigate();

	// Reset edidtingBuild/editingComment stats on page load
	useEffect(() => {
		resetStates();
		resetFilters();
	}, []);

	useEffect(() => {
		clearFetchedBuilds();

		if (!authLoading) {
			if (user?.username) {
				if (user?.favorites.length > 0) {
					fetchBuilds(user.favorites);
				} else {
					setBuildsLoading(false);
				}
			} else {
				setBuildsLoading(false);
			}
		}
	}, [authLoading]);

	// Listen for changes to the sorting and filter the builds accordingly
	useEffect(() => {
		let newFetchedBuilds = cloneDeep(fetchedBuilds);

		setSortedBuilds(filterBuilds(newFetchedBuilds));
	}, [fetchedBuilds, sortBy]);

	//---------------------------------------------------------------------------------------------------//
	return (
		<MiddleContainer color="none">
			<PlanetHeader text="Your Favorites" />
			<Sort />
			{!authLoading && user?.username && (
				<div className="flex flex-wrap md:grid md:grid-cols-3 2k:grid-cols-4 gap-8 2k:gap-16 w-full items-center justify-center md:justify-items-center mb-6 p-6 md:p-0">
					{loadingBuilds ? (
						<div className="flex flex-row w-full justify-center items-center">
							<div className="w-20">
								<Spinner1 />
							</div>
						</div>
					) : (
						<>
							{fetchedBuilds.length === 0 ? (
								<CantFind text="You haven't favorited any builds yet!">
									<Button text="Go find some!" icon="left" onClick={() => navigate('/')} color="btn-primary" />
								</CantFind>
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
			)}
		</MiddleContainer>
	);
}

export default Favorites;
