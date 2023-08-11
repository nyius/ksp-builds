import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
//---------------------------------------------------------------------------------------------------//
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';
import PlanetHeader from '../../components/header/PlanetHeader';
import Sort from '../../components/sort/Sort';
import Spinner2 from '../../components/spinners/Spinner2';
import CantFind from '../../components/cantFind/CantFind';
import Button from '../../components/buttons/Button';
//---------------------------------------------------------------------------------------------------//
import useResetStates from '../../hooks/useResetStates';
//---------------------------------------------------------------------------------------------------//
import { useResetFilters } from '../../context/filters/FiltersActions';
import { useGetFilteredBuilds, useFetchBuildsById } from '../../context/builds/BuildsActions';
import { useBuildsContext } from '../../context/builds/BuildsContext';
import { useAuthContext } from '../../context/auth/AuthContext';
import Builds from '../../components/builds/Builds';
import BuildsViewBtn from '../../components/buttons/BuildsViewBtn';

/**
 * Handles displaying users favorites
 * @returns
 */
function Favorites() {
	const { fetchedBuilds, loadingBuilds } = useBuildsContext();
	const { authLoading, user, isAuthenticated } = useAuthContext();
	const navigate = useNavigate();
	const [sortedBuilds] = useGetFilteredBuilds([]);

	useResetFilters();
	useResetStates();

	useFetchBuildsById(user?.favorites);

	//---------------------------------------------------------------------------------------------------//
	return (
		<>
			<Helmet>
				<meta charSet="utf-8" />
				<title>KSP Builds - Favorites</title>
				<link rel="canonical" href="https://kspbuilds.com/favorites" description="View your favorited builds & creations on KSP Builds." />
			</Helmet>

			<MiddleContainer color="none">
				<PlanetHeader text="Your Favorites" />
				<div className="flex flex-row gap-3 2k:gap-5">
					<Sort />
					<BuildsViewBtn />
				</div>
				{!authLoading && isAuthenticated && (
					<div className="flex flex-row flex-wrap w-full items-stretch justify-center md:justify-items-center mb-6 p-6 md:p-0">
						{loadingBuilds ? (
							<div className="flex flex-row w-full justify-center items-center">
								<div className="w-20">
									<Spinner2 />
								</div>
							</div>
						) : (
							<>
								{fetchedBuilds.length === 0 ? (
									<CantFind text="You haven't favorited any builds yet!">
										<Button text="Go find some!" icon="left" onClick={() => navigate('/')} color="btn-primary" />
									</CantFind>
								) : (
									<Builds buildsToDisplay={sortedBuilds} />
								)}
							</>
						)}
					</div>
				)}
			</MiddleContainer>
		</>
	);
}

export default Favorites;
