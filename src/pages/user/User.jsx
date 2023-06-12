import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { cloneDeep } from 'lodash';
import { useNavigate } from 'react-router-dom';
//---------------------------------------------------------------------------------------------------//
import AuthContext from '../../context/auth/AuthContext';
import { useFetchUser } from '../../context/auth/AuthActions';
import BuildsContext from '../../context/builds/BuildsContext';
import FiltersContext from '../../context/filters/FiltersContext';
import useFilters from '../../context/filters/FiltersActions';
import FoldersContext from '../../context/folders/FoldersContext';
import useBuilds from '../../context/builds/BuildsActions';
//---------------------------------------------------------------------------------------------------//
import Spinner1 from '../../components/spinners/Spinner1';
import { setBuildToAddToFolder, setOpenedFolder } from '../../context/folders/FoldersActions';
import Sort from '../../components/sort/Sort';
import CantFind from '../../components/cantFind/CantFind';
import Button from '../../components/buttons/Button';
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';
import Builds from '../../components/builds/Builds';
import Folders from '../../components/folders/Folders';
import Helmet from '../../components/Helmet/Helmet';
//---------------------------------------------------------------------------------------------------//
import DeleteAccountBtn from './Components/Buttons/DeleteAccountBtn';
import ProfilePicture from './Components/Buttons/ProfilePicture';
import MessageUserBtn from './Components/Buttons/MessageUserBtn';
import FollowUserBtn from './Components/Buttons/FollowUserBtn';
import BlockUserBtn from './Components/Buttons/BlockUserBtn';
import ReportUserBtn from './Components/Buttons/ReportUserBtn';
import Username from './Components/Username';
import UserBio from './Components/UserBio';
import UserDetails from './Components/UserDetails';

function User() {
	const usersId = useParams().id;
	const folderId = useParams().folderId;
	const navigate = useNavigate();
	//---------------------------------------------------------------------------------------------------//
	const [sortedBuilds, setSortedBuilds] = useState([]);
	//---------------------------------------------------------------------------------------------------//
	const { sortBy } = useContext(FiltersContext);
	const { fetchedBuilds } = useContext(BuildsContext);
	const { fetchedUserProfile, fetchingProfile, user, authLoading } = useContext(AuthContext);
	const { dispatchFolders, openedFolder } = useContext(FoldersContext);
	//---------------------------------------------------------------------------------------------------//
	const { fetchUsersProfile } = useFetchUser();
	const { filterBuilds } = useFilters();
	const { fetchBuildsById } = useBuilds();

	// Fetches the users profile first so we know what builds they have
	useEffect(() => {
		setOpenedFolder(dispatchFolders, null);
		setBuildToAddToFolder(dispatchFolders, null, user);
		fetchUsersProfile(usersId);
	}, []);

	// Fetches the users builds once we get their profile
	useEffect(() => {
		// Check if we found the users profile
		if (fetchedUserProfile) {
			if (folderId) {
				const folderToFetchId = fetchedUserProfile.folders?.filter(folder => folder.id === folderId);

				if (folderToFetchId.length > 0) {
					setOpenedFolder(dispatchFolders, folderToFetchId[0]);
				} else {
					const folderToFetchName = fetchedUserProfile.folders?.filter(folder => folder.urlName === folderId);

					if (folderToFetchName.length > 0) {
						setOpenedFolder(dispatchFolders, folderToFetchName[0]);
					} else {
						navigate(`/user/${usersId}`);
						fetchBuildsById(fetchedUserProfile.builds, fetchedUserProfile.uid, 'user');
					}
				}
			} else {
				fetchBuildsById(fetchedUserProfile.builds, fetchedUserProfile.uid, 'user');
			}
		}
	}, [fetchedUserProfile]);

	// Listen for changes to the sorting and filter the builds accordingly
	useEffect(() => {
		let newFetchedBuilds = cloneDeep(fetchedBuilds);

		setSortedBuilds(filterBuilds(newFetchedBuilds));
	}, [fetchedBuilds, sortBy]);

	//---------------------------------------------------------------------------------------------------//
	if (fetchingProfile) {
		return (
			<MiddleContainer>
				<Spinner1 />
			</MiddleContainer>
		);
	}

	if (!fetchingProfile && !fetchedUserProfile) {
		return (
			<MiddleContainer>
				<CantFind text="Oops.. user not found">
					<Button color="btn-primary" text="Return home" icon="left" onClick={() => navigate('/')} />
				</CantFind>
			</MiddleContainer>
		);
	}

	if (!fetchingProfile && fetchedUserProfile) {
		return (
			<>
				<Helmet title={fetchedUserProfile.username} pageLink="https://kspbuilds.com/profile/${fetchedUserProfile.uid}" />

				<MiddleContainer color="none">
					<DeleteAccountBtn />

					<div className="flex flex-col relative gap-14 items-center mb-10 bg-base-400 rounded-xl p-6 2k:p-12">
						<div className="flex flex-col gap-14 w-full">
							<div className="flex flex-col md:flex-row gap-14 w-full items-center">
								<div className="flex flex-col gap-3 2k:gap-4 w-full md:w-1/4">
									<ProfilePicture />

									{!authLoading && user?.username && user?.uid !== fetchedUserProfile.uid ? (
										<>
											<MessageUserBtn />
											<FollowUserBtn />
											<BlockUserBtn />
											<ReportUserBtn />
										</>
									) : null}
								</div>

								<div className="flex flex-col gap-3 2k:gap-6 w-full md:w-3/4">
									<Username />
									<UserBio />
								</div>
							</div>
							<UserDetails />
						</div>
					</div>

					{/* Folders */}
					<h2 className="text-xl 2k:text-3xl font-bold text-slate-100 mb-4 pixel-font">{fetchedUserProfile.username}'s Folders</h2>
					<Folders usersFolders={fetchedUserProfile.folders ? fetchedUserProfile.folders : []} editable={false} />

					{/* Builds */}
					<div className="flex flex-row flex-wrap gap-4 w-full place-content-between sm:mb-4">
						<h2 className="text-xl 2k:text-3xl font-bold text-slate-100 mb-4 pixel-font">{openedFolder ? openedFolder?.folderName : `${fetchedUserProfile.username}'s Builds`}</h2>
						<Sort />
					</div>
					<Builds buildsToDisplay={sortedBuilds} />
				</MiddleContainer>
			</>
		);
	}
}

export default User;
