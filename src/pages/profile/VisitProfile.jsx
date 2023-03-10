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
import Sort from '../../components/sort/Sort';
import CantFind from '../../components/cantFind/CantFind';
import Button from '../../components/buttons/Button';
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';

function VisitProfile() {
	const usersId = useParams().id;
	const navigate = useNavigate();
	//---------------------------------------------------------------------------------------------------//
	const [sortedBuilds, setSortedBuilds] = useState([]);
	const [dateCreated, setDateCreated] = useState(null);
	//---------------------------------------------------------------------------------------------------//
	const { typeFilter, versionFilters, searchTerm, tagsSearch, sortBy } = useContext(FiltersContext);
	const { fetchedBuilds, loadingBuilds, lastFetchedBuild } = useContext(BuildsContext);
	const { fetchedUserProfile, fetchingProfile, user, authLoading } = useContext(AuthContext);
	//---------------------------------------------------------------------------------------------------//
	const { fetchUsersProfile, setAccountToDelete } = useAuth();
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
				<MiddleContainer color="none">
					{!authLoading && user?.siteAdmin && <Button htmlFor="delete-account-modal" text="Delete Account (admin)" onClick={() => setAccountToDelete(usersId)} />}

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
									<CantFind text="This user has no builds yet :(" />
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
				</MiddleContainer>
			);
		} else {
			return (
				<CantFind text="Oops.. user not found">
					<Button color="btn-primary" text="Return home" icon="left" onClick={() => navigate('/')} />
				</CantFind>
			);
		}
	}
}

export default VisitProfile;
