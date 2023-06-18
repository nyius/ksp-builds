import React, { useContext, useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';
import { useNavigate } from 'react-router-dom';
//---------------------------------------------------------------------------------------------------//
import AuthContext from '../../context/auth/AuthContext';
import BuildsContext from '../../context/builds/BuildsContext';
import useBuilds, { setBuildsLoading, setClearFetchedBuilds } from '../../context/builds/BuildsActions';
import useFilters from '../../context/filters/FiltersActions';
import FiltersContext from '../../context/filters/FiltersContext';
import { setSelectedFolder, setBuildToAddToFolder, setFolderLocation } from '../../context/folders/FoldersActions';
import FoldersContext from '../../context/folders/FoldersContext';
//---------------------------------------------------------------------------------------------------//
import useResetStates from '../../utilities/useResetStates';
//---------------------------------------------------------------------------------------------------//
import Spinner1 from '../../components/spinners/Spinner1';
import Sort from '../../components/sort/Sort';
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';
import PlanetHeader from '../../components/header/PlanetHeader';
import Builds from '../../components/builds/Builds';
import Folders from '../../components/folders/Folders';
import Helmet from '../../components/Helmet/Helmet';
import ProfilePicture from './Components/ProfilePicture';
import ProfileInfo from './Components/ProfileInfo';
import ProfileDetails from './Components/ProfileDetails';

/**
 * Displays the users own profile
 * @returns
 */
function Profile() {
	const navigate = useNavigate();
	const { sortBy } = useContext(FiltersContext);
	const { dispatchBuilds, fetchedBuilds } = useContext(BuildsContext);
	const { user, authLoading } = useContext(AuthContext);
	const { dispatchFolders, openedFolder } = useContext(FoldersContext);
	//---------------------------------------------------------------------------------------------------//
	const { fetchBuildsById } = useBuilds();
	const { filterBuilds, resetFilters } = useFilters();
	const { resetStates } = useResetStates();
	//---------------------------------------------------------------------------------------------------//
	const [sortedBuilds, setSortedBuilds] = useState([]);

	useEffect(() => {
		setFolderLocation(dispatchFolders, 'profile');
		setSelectedFolder(dispatchFolders, null);
		setBuildToAddToFolder(dispatchFolders, null, user);
		resetStates();
		resetFilters();
	}, []);

	useEffect(() => {
		setClearFetchedBuilds(dispatchBuilds);

		if (!authLoading) {
			if (user?.username && user?.builds.length > 0) {
				fetchBuildsById(user.builds, user.uid, 'user');
			} else {
				setBuildsLoading(dispatchBuilds, false);
			}
		}
	}, [authLoading]);

	// Listen for changes to the sorting and filter the builds accordingly
	useEffect(() => {
		let newFetchedBuilds = cloneDeep(fetchedBuilds);

		setSortedBuilds(filterBuilds(newFetchedBuilds));
	}, [fetchedBuilds, sortBy]);

	//---------------------------------------------------------------------------------------------------//
	if (authLoading) {
		return (
			<MiddleContainer>
				<Spinner1 />
			</MiddleContainer>
		);
	}

	if (!authLoading && (!user || !user?.username)) {
		navigate('/');
	}

	return (
		<>
			<Helmet title="Profile" pagelink="https://kspbuilds.com/profile" />

			<MiddleContainer color="none">
				<PlanetHeader text="Profile" />

				<div className="flex flex-col gap-20 mb-10 bg-base-400 border-2 border-dashed border-slate-700 rounded-xl p-6 2k:p-12">
					<div className="flex flex-col md:flex-row gap-20 items-center">
						<ProfilePicture />
						<ProfileInfo />
					</div>

					<ProfileDetails />
				</div>

				<h2 className="text-xl 2k:text-3xl font-bold text-slate-100 mb-4 pixel-font">Your Folders</h2>
				<Folders />

				<div className="flex flex-row flex-wrap gap-4 w-full place-content-between sm:mb-4">
					<h2 className="text-xl 2k:text-3xl font-bold text-slate-100 mb-4 pixel-font">{openedFolder ? openedFolder?.folderName : 'Your Builds'}</h2>
					<Sort />
				</div>
				<Builds buildsToDisplay={sortedBuilds} />
			</MiddleContainer>
		</>
	);
}

export default Profile;
