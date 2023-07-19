import React from 'react';
import { useNavigate } from 'react-router-dom';
//---------------------------------------------------------------------------------------------------//
import { useAuthContext } from '../../context/auth/AuthContext';
import { useGetFilteredBuilds, useFetchBuildsById } from '../../context/builds/BuildsActions';
import { useResetFilters } from '../../context/filters/FiltersActions';
import { useSetBuildToAddToFolder, useSetFolderLocation, useSetSelectedFolders } from '../../context/folders/FoldersActions';
import { useFoldersContext } from '../../context/folders/FoldersContext';
//---------------------------------------------------------------------------------------------------//
import useResetStates from '../../hooks/useResetStates';
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
import BuildsViewBtn from '../../components/buttons/BuildsViewBtn';

/**
 * Displays the users own profile
 * @returns
 */
function Profile() {
	const { openedFolder } = useFoldersContext();
	const { user, authLoading, isAuthenticated } = useAuthContext();
	const [sortedBuilds] = useGetFilteredBuilds([]);
	const navigate = useNavigate();

	useResetFilters();
	useResetStates();

	useFetchBuildsById(user?.builds);
	useSetBuildToAddToFolder(null);
	useSetSelectedFolders(null);
	useSetFolderLocation('profile');

	//---------------------------------------------------------------------------------------------------//
	if (authLoading) {
		return (
			<MiddleContainer>
				<Spinner1 />
			</MiddleContainer>
		);
	}

	if (!authLoading && (!user || !isAuthenticated)) {
		navigate('/');
	}

	return (
		<>
			<Helmet title="Profile" pagelink="https://kspbuilds.com/profile" description="View your KSP Builds profile. See your uploads, change your bio & profile picture, and more." />

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
					<div className="flex flex-row gap-3 2k:gap-5">
						<Sort />
						<BuildsViewBtn />
					</div>
				</div>
				<Builds buildsToDisplay={sortedBuilds} />
			</MiddleContainer>
		</>
	);
}

export default Profile;
