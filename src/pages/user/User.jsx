import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { cloneDeep } from 'lodash';
import { useNavigate } from 'react-router-dom';
//---------------------------------------------------------------------------------------------------//
import AuthContext from '../../context/auth/AuthContext';
import { useFetchUser, setOpenProfile, setFetchingProfile } from '../../context/auth/AuthActions';
import BuildsContext from '../../context/builds/BuildsContext';
import FiltersContext from '../../context/filters/FiltersContext';
import useFilters from '../../context/filters/FiltersActions';
import FoldersContext from '../../context/folders/FoldersContext';
import useBuilds from '../../context/builds/BuildsActions';
//---------------------------------------------------------------------------------------------------//
import Spinner1 from '../../components/spinners/Spinner1';
import { setBuildToAddToFolder, setFolderLocation, setOpenedFolder, setUsersFolders } from '../../context/folders/FoldersActions';
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
import MessageUserBtn from '../../components/buttons/MessageUserBtn';
import FollowUserBtn from '../../components/buttons/FollowUserBtn';
import BlockUserBtn from '../../components/buttons/BlockUserBtn';
import ReportUserBtn from '../../components/buttons/ReportUserBtn';
import Username from './Components/Username';
import UserBio from './Components/UserBio';
import UserDetails from './Components/UserDetails';
import BuildsViewBtn from '../../components/buttons/BuildsViewBtn';

/**
 * The page to display a user
 * @returns
 */
function User() {
	const usersId = useParams().id;
	const folderId = useParams().folderId;
	const navigate = useNavigate();
	//---------------------------------------------------------------------------------------------------//
	const [sortedBuilds, setSortedBuilds] = useState([]);
	//---------------------------------------------------------------------------------------------------//
	const { sortBy } = useContext(FiltersContext);
	const { fetchedBuilds } = useContext(BuildsContext);
	const { dispatchAuth, openProfile, fetchingProfile, user, authLoading } = useContext(AuthContext);
	const { dispatchFolders, openedFolder } = useContext(FoldersContext);
	//---------------------------------------------------------------------------------------------------//
	const { fetchUsersProfile, checkIfUserInContext } = useFetchUser();
	const { filterBuilds } = useFilters();
	const { fetchBuildsById } = useBuilds();

	// Fetches the users profile first so we know what builds they have
	useEffect(() => {
		setOpenProfile(dispatchAuth, null);
		setFetchingProfile(dispatchAuth, true);

		let foundProfile = checkIfUserInContext(usersId);
		if (foundProfile) {
			setOpenProfile(dispatchAuth, foundProfile);
			setFetchingProfile(dispatchAuth, false);
		} else {
			fetchUsersProfile(usersId).then(fetchedUser => {
				setOpenProfile(dispatchAuth, fetchedUser);
			});
		}

		// Reset folder states
		setFolderLocation(dispatchFolders, 'user');
		setOpenedFolder(dispatchFolders, null);
		setBuildToAddToFolder(dispatchFolders, null, user);
	}, []);

	// Fetches the users builds once we get their profile
	useEffect(() => {
		// Check if we found the users profile
		if (openProfile && openProfile.username) {
			setUsersFolders(dispatchFolders, openProfile.folders ? openProfile.folders : []);
			if (folderId) {
				const folderToFetchId = openProfile.folders?.filter(folder => folder.id === folderId);

				if (folderToFetchId.length > 0) {
					setOpenedFolder(dispatchFolders, folderToFetchId[0]);
				} else {
					const folderToFetchName = openProfile.folders?.filter(folder => folder.urlName === folderId);

					if (folderToFetchName.length > 0) {
						setOpenedFolder(dispatchFolders, folderToFetchName[0]);
					} else {
						navigate(`/user/${usersId}`);
						fetchBuildsById(openProfile.builds, openProfile.uid, 'user');
					}
				}
			} else {
				fetchBuildsById(openProfile.builds, openProfile.uid, 'user');
			}
		}
	}, [openProfile]);

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

	if ((!fetchingProfile && !openProfile) || (!fetchingProfile && !openProfile?.username)) {
		return (
			<MiddleContainer>
				<CantFind text="Oops.. user not found">
					<Button color="btn-primary" text="Return home" icon="left" onClick={() => navigate('/')} />
				</CantFind>
			</MiddleContainer>
		);
	}

	if (!fetchingProfile && openProfile) {
		return (
			<>
				<Helmet title={openProfile.username} pageLink={`https://kspbuilds.com/profile/${openProfile.uid}`} description={`Public KSP Builds profile for ${openProfile.username}. View their builds, send a message, and more.`} />

				<MiddleContainer color="none">
					<DeleteAccountBtn />
					<div className="flex flex-col relative gap-14 items-center mb-10 bg-base-400 rounded-xl p-6 2k:p-12">
						<div className="flex flex-col gap-14 w-full">
							<div className="flex flex-col md:flex-row gap-14 w-full items-center">
								<div className="flex flex-col gap-3 2k:gap-4 w-full md:w-1/4">
									<ProfilePicture />

									{!authLoading && user?.username && user?.uid !== openProfile.uid ? (
										<>
											<MessageUserBtn text="Message" />
											<FollowUserBtn text="Follow" />
											<BlockUserBtn userToBlock={openProfile} />
											<ReportUserBtn userToReport={openProfile} />
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
					<h2 className="text-xl 2k:text-3xl font-bold text-slate-100 mb-4 pixel-font">{openProfile.username}'s Folders</h2>
					<Folders />

					{/* Builds */}
					<div className="flex flex-row flex-wrap gap-4 w-full place-content-between sm:mb-4">
						<h2 className="text-xl 2k:text-3xl font-bold text-slate-100 mb-4 pixel-font">{openedFolder ? openedFolder?.folderName : `${openProfile.username}'s Builds`}</h2>

						<div className="flex flex-row gap-3 2k:gap-6">
							<Sort />
							<BuildsViewBtn />
						</div>
					</div>
					<Builds buildsToDisplay={sortedBuilds} />
				</MiddleContainer>
			</>
		);
	}
}

export default User;
