import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { cloneDeep } from 'lodash';
import { useNavigate } from 'react-router-dom';
//---------------------------------------------------------------------------------------------------//
import AuthContext from '../../context/auth/AuthContext';
import useAuth from '../../context/auth/AuthActions';
import BuildsContext from '../../context/builds/BuildsContext';
import FiltersContext from '../../context/filters/FiltersContext';
import useFilters from '../../context/filters/FiltersActions';
import useBuilds from '../../context/builds/BuildsActions';
//---------------------------------------------------------------------------------------------------//
import Spinner1 from '../../components/spinners/Spinner1';
import BuildCard from '../../components/buildCard/BuildCard';
import Sort from '../index/Sort';
import PlanetExplosion from '../../assets/planet_explosion.png';

function VisitProfile() {
	const usersId = useParams().id;
	const navigate = useNavigate();
	//---------------------------------------------------------------------------------------------------//
	const [fetchedUser, setFetchedUser] = useState(null);
	const [sortedBuilds, setSortedBuilds] = useState([]);
	const [dateCreated, setDateCreated] = useState(null);
	//---------------------------------------------------------------------------------------------------//
	const { typeFilter, versionFilters, searchTerm, tagsSearch, sortBy } = useContext(FiltersContext);
	const { fetchedBuilds, loadingBuilds, lastFetchedBuild } = useContext(BuildsContext);
	const { fetchedUserProfile, fetchingProfile } = useContext(AuthContext);
	//---------------------------------------------------------------------------------------------------//
	const { fetchUsersProfile } = useAuth();
	const { filterBuilds, resetFilters } = useFilters();
	const { fetchBuilds } = useBuilds();

	// Fetches the users profile first so we know what builds they have
	useEffect(() => {
		fetchUsersProfile(usersId);
	}, []);

	// Fetches the users builds once we get their profile
	useEffect(() => {
		if (fetchedUserProfile) {
			fetchBuilds(fetchedUserProfile.builds);
			setDateCreated(new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(fetchedUserProfile.dateCreated.seconds * 1000));
		}
	}, [fetchedUserProfile]);

	// Listen for changes to the sorting and filter the builds accordingly
	useEffect(() => {
		let newFetchedBuilds = cloneDeep(fetchedBuilds);

		setSortedBuilds(filterBuilds(newFetchedBuilds));
	}, [fetchedBuilds, sortBy]);

	if (fetchingProfile) {
		return <Spinner1 />;
	} else {
		// If we find a profile
		if (fetchedUserProfile) {
			return (
				<div className="flex flex-col gap-4 w-full rounded-xl p-6">
					<div className="flex flex-row gap-14 items-center mb-10 bg-base-400 rounded-xl p-6 2k:p-12">
						{/* Profile Picture */}
						<div className="avatar">
							<div className="rounded-full w-44 ring ring-primary ring-offset-base-100 ring-offset-4">
								<img src={fetchedUserProfile.profilePicture} alt="" />
							</div>
						</div>

						{/* Username/bio/created */}
						<div className="flex flex-col gap-3 2k:gap-6 w-full">
							<p className="text-xl 2k:text-3xl">
								<span className="text-slate-500 2k:text-2xl italic">Username: </span> {fetchedUserProfile.username}
							</p>

							<p className="text-xl 2k:text-3xl">
								<span className="text-slate-500 2k:text-2xl italic">Date Created: </span> {dateCreated}
							</p>

							<div className="flex flex-row gap-2">
								<p className="text-slate-500 text-xl 2k:text-2xl italic">Bio: </p>
								{fetchedUserProfile.bio === '' ? <p className="italic text-slate-500 text-xl 2k:text-3xl">Nothing here...</p> : <p className="text-xl 2k:text-3xl"> {fetchedUserProfile.bio} </p>}
							</div>
						</div>
					</div>
					<h2 className="text-xl 2k:text-3xl font-bold text-slate-100 mb-4">{fetchedUserProfile.username}'s Builds</h2>

					{/* Builds */}
					<Sort />
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
				</div>
			);
		} else {
			return (
				<div className="flex flex-col gap-4 w-full h-fit rounded-xl p-12 2k:p-12 bg-base-900 justify-center items-center">
					<h1 className="text-2xl 2k:text-4xl font-bold">Oops.. user not found</h1>
					<button className="btn 2k:text-2xl" onClick={() => navigate('/')}>
						Return Home
					</button>
					<img className="w-1/2" src={PlanetExplosion} alt="Crashed Spaceship" />
				</div>
			);
		}
	}
}

export default VisitProfile;
