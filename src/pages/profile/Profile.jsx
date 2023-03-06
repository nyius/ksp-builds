import React, { useContext, useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';
import { toast } from 'react-toastify';
//---------------------------------------------------------------------------------------------------//
import AuthContext from '../../context/auth/AuthContext';
import BuildsContext from '../../context/builds/BuildsContext';
import useBuilds from '../../context/builds/BuildsActions';
import useFilters from '../../context/filters/FiltersActions';
import FiltersContext from '../../context/filters/FiltersContext';
import useAuth from '../../context/auth/AuthActions';
//---------------------------------------------------------------------------------------------------//
import BuildCard from '../../components/buildCard/BuildCard';
import Spinner1 from '../../components/spinners/Spinner1';
import Sort from '../index/Sort';
import LoadMoreBuilds from '../../components/buttons/LoadMoreBuilds';

function Profile() {
	const { typeFilter, versionFilters, searchTerm, tagsSearch, sortBy } = useContext(FiltersContext);
	const { fetchedBuilds, loadingBuilds, lastFetchedBuild } = useContext(BuildsContext);
	const { user, authLoading, editingProfile } = useContext(AuthContext);
	const { fetchBuilds } = useBuilds();
	const { setEditingProfile, updateUserDbBio } = useAuth();
	const [sortedBuilds, setSortedBuilds] = useState([]);
	const { filterBuilds, resetFilters } = useFilters();
	const [bio, setBio] = useState('');

	useEffect(() => {
		resetFilters();

		if (!authLoading) {
			if (user?.username && user?.builds.length > 0) {
				fetchBuilds(user.builds);
			}
		}
	}, []);

	// Listen for changes to the sorting and filter the builds accordingly
	useEffect(() => {
		let newFetchedBuilds = cloneDeep(fetchedBuilds);

		setSortedBuilds(filterBuilds(newFetchedBuilds));
	}, [fetchedBuilds, sortBy]);

	/**
	 * Handles updating the users bio
	 */
	const handleSubmitBioUpdate = async () => {
		await updateUserDbBio(bio);
		setEditingProfile(false);
	};

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className="flex flex-col gap-4  w-full rounded-xl p-6">
			<h1 className="text-2xl 2k:text-4xl font-bold text-slate-100 mb-4">Profile</h1>
			{!authLoading && user.username && (
				<>
					<div className="flex flex-row gap-20 items-center mb-10 bg-base-400 rounded-xl p-6">
						<div className="avatar">
							<div className="rounded-full w-44 ring ring-primary ring-offset-base-100 ring-offset-4">
								<img src={user.profilePicture} alt="" />
							</div>
						</div>
						<div className="flex flex-col gap-3 w-full">
							<p className="text-xl font-bold">{user.username}</p>
							{editingProfile ? (
								<>
									<textarea onChange={e => setBio(e.target.value)} defaultValue={user.bio} name="" id="" rows="4" className="textarea w-full text-xl"></textarea>
									<div className="flex flex-row gap-4">
										<button onClick={handleSubmitBioUpdate} className="btn w-fit">
											Save
										</button>
										<button onClick={() => setEditingProfile(false)} className="btn w-fit">
											Cancel
										</button>
									</div>
								</>
							) : (
								<>
									{user.bio === '' ? <p className="italic text-slate-500 text-xl">No bio yet</p> : <p className="text-xl"> {user.bio} </p>}
									<button onClick={() => setEditingProfile(true)} className="btn btn-sm w-fit mt-3 mb-4">
										Edit Bio
									</button>
								</>
							)}
							<p className="text-xl">
								<span className="text-slate-500">Email:</span> {user.email}
							</p>
						</div>
					</div>
					<h2 className="text-xl 2k:text-2xl font-bold text-slate-100 mb-4">Your Builds</h2>

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
				</>
			)}
		</div>
	);
}

export default Profile;
