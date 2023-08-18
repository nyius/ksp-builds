import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useFoldersContext } from './FoldersContext';
import { useAuthContext } from '../auth/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { setFetchingProfile, updateUserState, useFetchUser } from '../auth/AuthActions';
import { cloneDeep } from 'lodash';
import { db } from '../../firebase.config';
import { profanity } from '@2toad/profanity';
import { buildNameToUrl } from '../../utilities/buildNameToUrl';
import { checkForSameNameFolder, checkIfBuildInFolder } from './FoldersUtilils';
import { setLocalStoredUser } from '../../utilities/userLocalStorage';
import { useBuildContext } from '../build/BuildContext';
import { useUpdateBuild } from '../build/BuildActions';
import { useEffect, useState } from 'react';
import useBuilds from '../builds/BuildsActions';
import errorReport from '../../utilities/errorReport';

/**
 * Hook with functions for adding a new folder
 * @returns
 */
function useAddNewFolder() {
	const { dispatchFolders, newFolderName } = useFoldersContext();
	const { user, dispatchAuth } = useAuthContext();

	/**
	 * Handles making a new folder
	 */
	const handleAddNewFolder = () => {
		if (!newFolderName || newFolderName.trim() === '') {
			setNewFolderName(dispatchFolders, '');
			setMakingNewFolder(dispatchFolders, false);
			toast.error('Folder needs a name!');
			errorReport(`Folder needs a name!`, false, 'handleAddNewFolder');
			return;
		}

		if (newFolderName.length > 50) {
			toast.error('Folder name too long!');
			errorReport(`Folder name too long!`, false, 'handleAddNewFolder');
			return;
		}

		if (profanity.exists(newFolderName)) {
			toast.error('Folder name not acceptable!');
			errorReport(`Folder name  not acceptable`, false, 'handleAddNewFolder');
			return;
		}

		addNewFolder(newFolderName);
		setNewFolderName(dispatchFolders, '');
		setMakingNewFolder(dispatchFolders, false);
	};

	/**
	 * Handles adding a new folder
	 * @param {string} folderName
	 */
	const addNewFolder = async folderName => {
		try {
			const id = uuidv4().slice(0, 20);
			let sameNameCount = checkForSameNameFolder(user.folders, folderName);
			let urlName;
			if (sameNameCount > 0) {
				urlName = buildNameToUrl(folderName + '-' + sameNameCount);
			} else {
				urlName = buildNameToUrl(folderName);
			}

			const newFolder = { folderName, id, builds: [], urlName };

			updateUserState(dispatchAuth, { folders: user.folders ? [...user.folders, newFolder] : [newFolder] });

			await updateDoc(doc(db, 'users', user.uid), { folders: user.folders ? [...user.folders, newFolder] : [newFolder] });
			await updateDoc(doc(db, 'userProfiles', user.uid), { folders: user.folders ? [...user.folders, newFolder] : [newFolder] });

			toast.success('Folder added!');
		} catch (error) {
			errorReport(error.message, true, 'addNewFolder');
			toast.error('Something went wrong, please try again');
		}
	};

	return {
		handleAddNewFolder,
	};
}

/**
 * Hook for deleting a folder
 * @returns
 */
export const useDeleteFolder = () => {
	const { user, dispatchAuth } = useAuthContext();
	const { dispatchFolders, deleteFolderId } = useFoldersContext();

	/**
	 * Handles deleting a folder
	 */
	const deleteFolder = async () => {
		try {
			const newFolders = user.folders.filter(folder => folder.id !== deleteFolderId);
			setDeleteFolder(dispatchFolders, null, null);
			updateUserState(dispatchAuth, { folders: newFolders });
			setOpenedFolder(dispatchFolders, null);

			await updateDoc(doc(db, 'users', user.uid), { folders: newFolders });
			await updateDoc(doc(db, 'userProfiles', user.uid), { folders: newFolders });
			toast.success('Folder deleted.');
		} catch (error) {
			errorReport(error.message, true, 'useDeleteFolder');
			toast.error('Something went wrong, please try again');
		}
	};

	return { deleteFolder };
};
/**
 * Hook for adding a build to a folder
 * @returns
 */
export const useAddBuildToFolder = () => {
	const { user } = useAuthContext();
	const { dispatchFolders, selectedFolders } = useFoldersContext();
	const { updateAllFolders } = useUpdateFolder();
	const { loadedBuild } = useBuildContext();
	const { updateBuild } = useUpdateBuild();

	/**
	 * handles adding a build to a folder/folders
	 * @param {string} buildId - buildId of build to add
	 * @param {string} folderId - (optional) the id of the folder to add the build to. (if no folderId supplied, it will add the build to all folders currently selected)
	 */
	const addBuildToFolder = async (buildId, folderId) => {
		try {
			let newFolders = cloneDeep(selectedFolders);
			let usersFolders = cloneDeep(user.folders);
			setSavingToFolder(dispatchFolders, folderId ? folderId : true);
			setTimeout(() => {
				setSavingToFolder(dispatchFolders, false);
			}, 1500);

			if (folderId) {
				// Loop over the users existing folders
				usersFolders.map(folder => {
					// check if a folder contains the build we want to save
					if (folder.builds.includes(buildId)) {
						// See if this folder is the folder we want to save to.
						// if it is, that means that the user wants to remove the build from that folder
						if (folder.id === folderId) {
							const buildIndex = folder.builds.indexOf(buildId);
							folder.builds.splice(buildIndex, 1);
							toast.success('Build Removed.');

							// Check if the build has the folder pinned. If it does, remove the pin from the folder
							if (loadedBuild) {
								if (loadedBuild.pinnedFolder === folder.id) {
									const buildToUpdate = cloneDeep(loadedBuild);
									buildToUpdate.pinnedFolder = null;

									updateBuild(buildToUpdate);
								}
							}
						}
					} else {
						// if the folder doesnt include the builds id, check if we have this folder selected.
						// If we do have this folder selected, add the build to it
						if (folder.id === folderId) {
							folder.builds.push(buildId);
							toast.success('Build Saved!');
						}
					}
				});
			} else {
				// Loop over the users existing folders
				usersFolders.map(folder => {
					// check if a folder contains the build we want to save
					if (folder.builds.includes(buildId)) {
						// If this existing folder contains our build, see if we have this folder selected
						// If this folder was not selected but contains the build, it means the user wants to remove the build from this folder
						const folderIndex = newFolders.findIndex(newFolder => newFolder.id !== 'your-builds' && newFolder.id === folder.id);

						if (folderIndex < 0) {
							const buildIndex = folder.builds.indexOf(buildId);
							folder.builds.splice(buildIndex, 1);

							// Check if the build has the folder pinned. If it does, remove the pin from the folder
							if (loadedBuild) {
								if (loadedBuild.pinnedFolder === folder.id) {
									const buildToUpdate = cloneDeep(loadedBuild);
									buildToUpdate.pinnedFolder = null;

									updateBuild(buildToUpdate);
								}
							}
						}
					} else {
						// if the folder doesnt include the builds id, check if we have this folder selected.
						// If we do have this folder selected, add the build to it
						const folderIndex = newFolders.findIndex(newFolder => newFolder.id !== 'your-builds' && newFolder.id === folder.id);
						if (folderIndex >= 0) {
							folder.builds.push(buildId);
						}
					}
				});
				toast.success('Folders Saved!');
			}

			await updateAllFolders(usersFolders);
			setSelectedFolder(dispatchFolders, null);
			setOpenedFolder(dispatchFolders, null);
			setAddBuildToFolderModal(dispatchFolders, false);
			setMakingNewFolder(dispatchFolders, false);
			setNewFolderName(dispatchFolders, null);
		} catch (error) {
			errorReport(error.message, true, 'addBuildToFolder');
			toast.error('Something went wrong, please try again');
		}
	};

	return { addBuildToFolder };
};

/**
 * Hook for handling folder clicks
 * @returns
 */
export const useHandleFolderInteraction = () => {
	const { dispatchFolders, makingNewFolder, editingFolder, lastClickTime, selectedFolders, editingFolderName, longClickStart, lastSelectedFolderId, openedFolder } = useFoldersContext();
	const { updateFolder } = useUpdateFolder();
	const { handleAddNewFolder } = useAddNewFolder();
	const { user } = useAuthContext();
	const navigate = useNavigate();
	const location = useLocation();

	/**
	 * handles double clicking a folder to open it
	 * @param {obj} folder
	 */
	const handleFolderClick = folder => {
		const currentTime = new Date().getTime();

		if (editingFolder) {
			checkIfEditingFolder();
		}
		if (lastClickTime > 0) {
			if (currentTime - lastClickTime < 400 && folder.id === lastSelectedFolderId) {
				setOpenedFolder(dispatchFolders, folder);

				const currentLocation = location.pathname.split('/')[1];

				if (currentLocation === 'user') {
					const currentUserId = location.pathname.split('/')[2];

					navigate(`/user/${currentUserId}/folder/${folder.urlName}`);
				} else {
					if (folder.id === 'your-builds') {
						navigate(`/profile`);
					} else {
						navigate(`/profile/folder/${folder.urlName}`);
					}
				}
			} else {
				setLastClickTime(dispatchFolders, currentTime);
			}
		} else {
			setLastClickTime(dispatchFolders, currentTime);
		}
	};

	/**
	 * Handles a key being pressed while a folder is selected
	 * @param {event} e
	 * @param {obj} folder
	 */
	const handleFolderKeyPress = (e, folder) => {
		if (selectedFolders) {
			if (editingFolderName) {
				if (e.key === 'Enter') {
					if (editingFolderName !== folder.folderName) {
						const newFolder = cloneDeep(folder);
						newFolder.folderName = editingFolderName;
						updateFolder(newFolder);
						setEditingFolder(dispatchFolders, false);
						setEditingFolderName(dispatchFolders, null);
					} else {
						setEditingFolder(dispatchFolders, false);
						setEditingFolderName(dispatchFolders, null);
					}
				} else if (e.key === 'Escape') {
					setEditingFolder(dispatchFolders, false);
					setEditingFolderName(dispatchFolders, null);
				}
			} else {
				if (e.key === 'F2') {
					setEditingFolder(dispatchFolders, folder);
					setEditingFolderName(dispatchFolders, folder.folderName);
				} else if (e.key === 'Delete') {
					setDeleteFolder(dispatchFolders, folder.id, folder.folderName);
				} else if (e.key === 'Enter') {
					setOpenedFolder(dispatchFolders, folder);
				}
			}
		}
	};

	/**
	 * Handles checking if the user wants to rename the folder VIA long mouse click (like in windows explorer)
	 * @param {obj} folder
	 */
	const handleFolderLongClick = folder => {
		if (longClickStart > 0) {
			const endTime = new Date().getTime();

			if (endTime - longClickStart > 600) {
				setEditingFolder(dispatchFolders, folder);
				setEditingFolderName(dispatchFolders, folder.folderName);
			} else {
				setLongClickStart(dispatchFolders, 0);
			}
		}
	};

	/**
	 * Handles when a user clicks off of a folder and we need to save any name changes
	 * @param {event} e
	 */
	const handleFolderBlur = e => {
		if (!e.relatedTarget) {
			setSelectedFolder(dispatchFolders, null);
			checkIfEditingFolder();
		}
	};

	/**
	 * Handles a key being pressed while making a new folder
	 * @param {event} e
	 */
	const handleNewFolderKeyPress = e => {
		if (makingNewFolder) {
			if (e.key === 'Enter') {
				handleAddNewFolder();
			} else if (e.key === 'Escape') {
				setNewFolderName(dispatchFolders, '');
				setMakingNewFolder(dispatchFolders, false);
			}
		}
	};

	/**
	 * Handles when user clicks off making a new folder
	 * @param {evene} e
	 */
	const handleNewFolderBlur = e => {
		if (!e.relatedTarget || e.relatedTarget?.parentElement.id.includes('tooltip')) {
			handleAddNewFolder();
		}
	};

	/**
	 * Checks if a folder is being edited, and if it is to either save the changes or discard them
	 */
	const checkIfEditingFolder = () => {
		if (editingFolder) {
			if (editingFolderName !== editingFolder.folderName) {
				const newFolder = cloneDeep(editingFolder);
				newFolder.folderName = editingFolderName;
				updateFolder(newFolder);
				setEditingFolder(dispatchFolders, false);
				setEditingFolderName(dispatchFolders, null);
			} else {
				setEditingFolder(dispatchFolders, false);
				setEditingFolderName(dispatchFolders, null);
			}
		}
	};

	/**
	 *Checks if a folder is open
	 * @param {stirng} folderId - the id of the folder to check
	 */
	const checkIfFolderOpen = id => {
		if (openedFolder) {
			return openedFolder.id === id;
		}
	};

	return { handleFolderClick, handleFolderLongClick, handleFolderBlur, handleFolderKeyPress, handleNewFolderBlur, handleNewFolderKeyPress, checkIfFolderOpen };
};

/**
 * Hook that contains functions to update folders on the server
 */
export const useUpdateFolder = () => {
	const { user, dispatchAuth } = useAuthContext();

	/**
	 * handles updating a single folder
	 * @param {obj} updatedFolder - the updated folder
	 */
	const updateFolder = async updatedFolder => {
		try {
			const updatedFolderIndex = user.folders.findIndex(folder => folder.id === updatedFolder.id);
			const newFolders = cloneDeep(user.folders);
			if (newFolders[updatedFolderIndex].folderName !== updatedFolder.folderName) {
				if (!updatedFolder.folderName || updatedFolder.folderName.trim() === '') {
					toast.error('Folder needs a name!');
					errorReport(`Folder needs a name!`, false, 'updateFolder');
					return;
				}

				if (updatedFolder.folderName.length > 50) {
					toast.error('Folder name too long!');
					errorReport(`Folder name too long!`, false, 'updateFolder');
					return;
				}

				if (profanity.exists(updatedFolder.folderName)) {
					toast.error('Folder name not acceptable!');
					errorReport(`Folder name  not acceptable`, false, 'updateFolder');
					return;
				}

				let sameNameCount = checkForSameNameFolder(newFolders, updatedFolder.folderName);
				if (sameNameCount > 1) {
					updatedFolder.urlName = buildNameToUrl(updatedFolder.folderName + '-' + sameNameCount);
				} else {
					updatedFolder.urlName = buildNameToUrl(updatedFolder.folderName);
				}
			}

			newFolders[updatedFolderIndex] = updatedFolder;

			updateUserState(dispatchAuth, { folders: newFolders });

			await updateDoc(doc(db, 'users', user.uid), { folders: newFolders });
			await updateDoc(doc(db, 'userProfiles', user.uid), { folders: newFolders });
			setLocalStoredUser(user.uid, user);

			toast.success('Folder Updated!');
		} catch (error) {
			errorReport(error.message, true, 'updateFolder');
			toast.error('Something went wrong, please try again');
		}
	};

	/**
	 * Handles updaing all of the folders ath the same time. takes in an array of all of the folders
	 * @param {arr} newFolders
	 */
	const updateAllFolders = async newFolders => {
		try {
			const updatedUser = cloneDeep(user);
			updateUserState(dispatchAuth, { folders: newFolders });
			updatedUser.folders = newFolders;

			await updateDoc(doc(db, 'users', user.uid), { folders: newFolders });
			await updateDoc(doc(db, 'userProfiles', user.uid), { folders: newFolders });
			setLocalStoredUser(user.uid, updatedUser);
		} catch (error) {
			errorReport(error.message, true, 'updateAllFolders');
			toast.error('Something went wrong, please try again');
		}
	};

	return { updateFolder, updateAllFolders };
};

/**
 * handles setting the folders we are viewing owner
 */
export const useSetCurrentFolderOwner = () => {
	const location = useLocation();
	let currentUser = location.pathname.split('/')[2];
	//---------------------------------------------------------------------------------------------------//
	const { folderLocation, dispatchFolders } = useFoldersContext();
	const { user } = useAuthContext();

	useEffect(() => {
		if (folderLocation === 'user') {
			setCurrentFolderOwner(dispatchFolders, currentUser);
		} else if (folderLocation === 'profile' || folderLocation === 'popup') {
			setCurrentFolderOwner(dispatchFolders, user?.username);
		}
	}, [folderLocation, dispatchFolders, currentUser, user]);

	useEffect(() => {
		if (folderLocation !== 'user') {
			setUsersFolders(dispatchFolders, null);
		}
	}, [folderLocation, dispatchFolders]);
};

/**
 * Handles clearing the current open folder
 */
export const useResetOpenFolder = () => {
	const { dispatchFolders } = useFoldersContext();
	useEffect(() => {
		setOpenedFolder(dispatchFolders, null);
	}, []);
};

/**
 * Handles setting if the users own personal folder (Likes "Nyius's builds") should be hidden or visible
 * This is hidden where we dont want the user to add someone elses build to their own personal builds list
 * @param {bool} initialState
 * @returns
 */
export const useHideOwnFolder = initialState => {
	const { folderLocation } = useFoldersContext();
	const [hideOwnFolder, setHideOwnFolder] = useState(initialState);

	useEffect(() => {
		if (folderLocation === 'popup') {
			setHideOwnFolder(true);
		} else if (folderLocation === 'upload') {
			setHideOwnFolder(false);
		} else if (folderLocation === 'profile') {
			setHideOwnFolder(false);
		} else if (folderLocation === 'user') {
			setHideOwnFolder(true);
		}
	}, [folderLocation]);

	return [hideOwnFolder, setHideOwnFolder];
};

/**
 * Handles returning a users personal builds folder
 * @param {*} initialState
 * @returns [personalBuildsFolder, setPersonalBuildsFolder]
 */
export const useSetPersonalBuildsFolder = initialState => {
	const [personalBuildsFolder, setPersonalBuildsFolder] = useState(initialState);
	const { folderLocation } = useFoldersContext();
	const { user, authLoading, isAuthenticated, openProfile, fetchingProfile } = useAuthContext();

	useEffect(() => {
		if (folderLocation !== 'user') {
			if (!authLoading && isAuthenticated) {
				setPersonalBuildsFolder(prevState => {
					return {
						...prevState,
						builds: user.builds,
					};
				});
			}
		} else if (folderLocation === 'user') {
			if (!fetchingProfile && openProfile) {
				setPersonalBuildsFolder(prevState => {
					return {
						...prevState,
						builds: openProfile.builds,
						folderName: `${openProfile.username}'s Builds`,
						id: `${buildNameToUrl(openProfile.username)}s-builds`,
						urlName: `${buildNameToUrl(openProfile.username)}s-builds`,
					};
				});
			}
		}
	}, [authLoading, folderLocation, isAuthenticated, fetchingProfile, openProfile]);

	return [personalBuildsFolder, setPersonalBuildsFolder];
};

/**
 * Handles setting a builds pinned folder. uses the current loaded build.
 */
export const useSetPinnedFolder = pinnedFolder => {
	const { loadingBuild, loadedBuild } = useBuildContext();
	const { dispatchFolders } = useFoldersContext();

	useEffect(() => {
		if (loadingBuild) return;
		setPinnedFolder(dispatchFolders, pinnedFolder ? pinnedFolder : loadedBuild?.pinnedFolder);
	}, [loadingBuild, loadedBuild, dispatchFolders, pinnedFolder]);
};

/**
 * Handles fetching a pinned folder and all of its builds.
 * @param {*} initialState - [fetchedFolder, setFetchedFolder]
 * @returns
 */
export const useFetchPinnedFolder = initialState => {
	const [fetchedFolder, setFetchedFolder] = useState(initialState);
	const { loadingBuild, loadedBuild } = useBuildContext();
	const { dispatchFolders } = useFoldersContext();
	const { dispatchAuth } = useAuthContext();
	const { fetchUsersProfile, checkIfUserInContext } = useFetchUser();
	const { fetchBuildsById } = useBuilds();

	useEffect(() => {
		if (loadingBuild) return;
		if (loadedBuild.pinnedFolder) {
			// If the current opened build has a pinned folder, Get the profile of the builds author
			// Then get this pinned folder from their list of folders
			// Loop over that folder and fetch all of the builds in that folder
			let foundProfile = checkIfUserInContext(loadedBuild.uid);
			if (foundProfile) {
				const foundFolder = foundProfile.folders.filter(folder => loadedBuild.pinnedFolder === folder.id);
				if (foundFolder.length > 0) {
					fetchBuildsById(foundFolder[0].builds, null, 'public');
					setFetchedFolder(foundFolder[0]);
					setFetchedPinnedFolder(dispatchFolders, foundFolder[0]);
					setFetchingProfile(dispatchAuth, false);
				} else {
					errorReport('Couldnt find folder from user in context', false, 'useFetchPinnedFolder');
				}
			} else {
				setFetchingProfile(dispatchAuth, true);
				fetchUsersProfile(loadedBuild.uid)
					.then(fetchedUser => {
						const foundFolder = fetchedUser.folders.filter(folder => loadedBuild.pinnedFolder === folder.id);
						if (foundFolder.length > 0) {
							setFetchedFolder(foundFolder[0]);
							setFetchedPinnedFolder(dispatchFolders, foundFolder[0]);
							fetchBuildsById(foundFolder[0].builds, null, 'public');
							setFetchingProfile(dispatchAuth, false);
						} else {
							throw new Error("Couldn't find folder from server");
						}
					})
					.catch(error => {
						errorReport(error.message, true, 'useFetchPinnedFolder');
						setFetchingProfile(dispatchAuth, false);
					});
			}
		}
	}, [loadedBuild, loadingBuild]);

	return [fetchedFolder, setFetchedFolder];
};

/**
 * handles setting the ID of the build we want to add to a folder in context
 * @param {string} buildId - id of the build to add
 */
export const useSetBuildToAddToFolder = buildId => {
	const { dispatchFolders } = useFoldersContext();
	const { user } = useAuthContext();

	useEffect(() => {
		dispatchFolders({
			type: 'SET_FOLDERS',
			payload: { buildToAddToFolder: buildId },
		});

		/*	
		let folders = [];

		user?.folders?.map(folder => {
			if (checkIfBuildInFolder(buildId, folder.id, user)) {
				folders.push(folder);
			}
		});

		dispatchFolders({
			type: 'SET_FOLDERS',
			payload: { selectedFolders: folders },
		});
		*/
	}, []);
};

/**
 * handles setting the start time for a long click on a folder (like for editing its name)
 * @param {obj} selectedFolder - the selected folder
 */
export const useSetSelectedFolders = newSelectedFolder => {
	const { dispatchFolders, selectedFolders, buildToAddToFolder } = useFoldersContext();

	useEffect(() => {
		if (!newSelectedFolder) {
			dispatchFolders({
				type: 'SET_FOLDERS',
				payload: { selectedFolders: [] },
			});

			return;
		}
		let newSelectedFolders = cloneDeep(selectedFolders);
		const folderIndex = selectedFolders.findIndex(folder => folder.id === newSelectedFolder.id);

		// If we've already selected the folder, remove it
		if (folderIndex >= 0) {
			newSelectedFolders.splice(folderIndex, 1);
		} else {
			if (buildToAddToFolder) {
				newSelectedFolders.push(newSelectedFolder);
			} else {
				newSelectedFolders = [newSelectedFolder];
			}
		}

		dispatchFolders({
			type: 'SET_FOLDERS',
			payload: { selectedFolders: newSelectedFolders },
		});
	}, [newSelectedFolder, buildToAddToFolder]);
};

/**
 * Handles setting the current folder location
 * @param {*} location
 */
export const useSetFolderLocation = location => {
	const { dispatchFolders } = useFoldersContext();

	useEffect(() => {
		setFolderLocation(dispatchFolders, location);
	}, [location]);
};

/**
 * Handles setting the current open users profile
 */
export const useSetOpenUsersFolders = () => {
	const { openProfile } = useAuthContext();
	const { dispatchFolders } = useFoldersContext();

	// Fetches the users builds once we get their profile
	useEffect(() => {
		// Check if we found the users profile
		if (openProfile && openProfile.username) {
			setUsersFolders(dispatchFolders, openProfile.folders ? openProfile.folders : []);
		}
	}, [openProfile]);
};

/**
 * Checks the URL for a folder id. If we have a folder in the url, sets that as open folder and fetches all of the builds.
 * If theres no folder in the url, fetches the users own builds.
 * @param {*} usersId
 */
export const useCheckOpenProfileFolderAndFetchBuilds = usersId => {
	const { openProfile } = useAuthContext();
	const { dispatchFolders } = useFoldersContext();
	const folderId = useParams().folderId;
	const navigate = useNavigate();
	const { fetchBuildsById } = useBuilds();
	const { user } = useAuthContext();

	// Fetches the users builds once we get their profile
	useEffect(() => {
		// Check if we found the users profile
		if (openProfile && openProfile.username && usersId) {
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
		} else {
			if (folderId) {
				const folderToFetchId = user.folders?.filter(folder => folder.id === folderId);

				if (folderToFetchId.length > 0) {
					setOpenedFolder(dispatchFolders, folderToFetchId[0]);
				} else {
					const folderToFetchName = user.folders?.filter(folder => folder.urlName === folderId);

					if (folderToFetchName.length > 0) {
						setOpenedFolder(dispatchFolders, folderToFetchName[0]);
					} else {
						navigate(`/profile`);
						fetchBuildsById(user.builds, user.uid, 'user');
					}
				}
			} else {
				fetchBuildsById(user.builds, user.uid, 'user');
			}
		}
	}, [openProfile]);
};

export default useAddNewFolder;

// State Managers---------------------------------------------------------------------------------------------------//
/**
 * handles setting the currently open folder.
 * @param {obj} folder - the currently open folder
 */
export const setOpenedFolder = async (dispatchFolders, folder) => {
	dispatchFolders({
		type: 'SET_FOLDERS',
		payload: { openedFolder: folder },
	});
};

/**
 * handles setting the time when a folder was clicked
 * @param {function} dispatchFolders - dispatch function
 * @param {string} time - takes in a new Date() time
 */
export const setLastClickTime = (dispatchFolders, time) => {
	dispatchFolders({
		type: 'SET_FOLDERS',
		payload: { lastClickTime: time },
	});
};

/**
 * handles setting the folder to edit
 * @param {function} dispatchFolders - dispatch function
 * @param {obj} folder - the folder to edit
 */
export const setEditingFolder = (dispatchFolders, folder) => {
	dispatchFolders({
		type: 'SET_FOLDERS',
		payload: { editingFolder: folder },
	});
};

/**
 * handles setting the name of the folder being edited
 * @param {function} dispatchFolders - dispatch function
 * @param {string} folderName - the name of the folder being edited
 */
export const setEditingFolderName = (dispatchFolders, folderName) => {
	dispatchFolders({
		type: 'SET_FOLDERS',
		payload: { editingFolderName: folderName },
	});
};

/**
 * handles setting the start time for a long click on a folder (like for editing its name)
 * @param {function} dispatchFolders - dispatch function
 * @param {string} time - takes in a new Date() time
 */
export const setLongClickStart = (dispatchFolders, time) => {
	dispatchFolders({
		type: 'SET_FOLDERS',
		payload: { longClickStart: time },
	});
};

/**
 * handles setting the view for viewing list of folders
 * @param {function} dispatchFolders - dispatch function
 * @param {string} option - Grid / List
 */
export const setFolderView = (dispatchFolders, option) => {
	localStorage.setItem('folderView', option);
	dispatchFolders({
		type: 'SET_FOLDERS',
		payload: { folderView: option },
	});
};

/**
 * handles setting the id of the folder to delete
 * @param {function} dispatchFolders - dispatch function
 * @param {string} folderId - id of folder to delete
 * @param {string} deleteFolderName - name of folder to delete
 */
export const setDeleteFolder = (dispatchFolders, folderId, deleteFolderName) => {
	dispatchFolders({
		type: 'SET_FOLDERS',
		payload: { deleteFolderId: folderId, deleteFolderName },
	});
};

/**
 * handles setting the start time for a long click on a folder (like for editing its name)
 * @param {function} dispatchFolders - dispatch function
 * @param {obj} selectedFolder - the selected folder
 * @param {arr} selectedFolders - All of the currently selected folders
 * @param {string} buildToAddToFolder - a build to add to folder
 */
export const setSelectedFolder = (dispatchFolders, selectedFolder, selectedFolders, buildToAddToFolder) => {
	if (!selectedFolder) {
		dispatchFolders({
			type: 'SET_FOLDERS',
			payload: { selectedFolders: [] },
		});

		return;
	}

	let newSelectedFolders = cloneDeep(selectedFolders);
	const folderIndex = selectedFolders.findIndex(folder => folder.id === selectedFolder.id);

	// If we've already selected the folder, remove it
	if (folderIndex >= 0) {
		newSelectedFolders.splice(folderIndex, 1);
	} else {
		if (buildToAddToFolder) {
			newSelectedFolders.push(selectedFolder);
		} else {
			newSelectedFolders = [selectedFolder];
		}
	}

	dispatchFolders({
		type: 'SET_FOLDERS',
		payload: { selectedFolders: newSelectedFolders },
	});
};

/**
 * handles setting if the user is making a new folder
 * @param {function} dispatchFolders - dispatch function
 * @param {bool} bool - true or false
 */
export const setMakingNewFolder = (dispatchFolders, bool) => {
	dispatchFolders({
		type: 'SET_FOLDERS',
		payload: { makingNewFolder: bool },
	});
};

/**
 * Handles setting the new folder name in context
 * @param {function} dispatchFolders - dispatch function
 * @param {string} folderName - New folder name
 */
export const setNewFolderName = (dispatchFolders, folderName) => {
	dispatchFolders({
		type: 'SET_FOLDERS',
		payload: { newFolderName: folderName },
	});
};

/**
 * handles setting the ID of the build we want to add to a folder in context
 * @param {function} dispatchFolders - dispatch function
 * @param {string} buildId - id of the build to add
 * @param {obj} user - the current logged in user
 */
export const setBuildToAddToFolder = (dispatchFolders, buildId, user) => {
	dispatchFolders({
		type: 'SET_FOLDERS',
		payload: { buildToAddToFolder: buildId },
	});

	let folders = [];

	user?.folders?.map(folder => {
		if (checkIfBuildInFolder(buildId, folder.id, user)) {
			folders.push(folder);
		}
	});

	dispatchFolders({
		type: 'SET_FOLDERS',
		payload: { selectedFolders: folders },
	});
};

/**
 * Handles setting if the Modal for adding a build to a folder is open or not
 * @param {function} dispatchFolders - dispatch function
 * @param {bool} bool - true or false
 */
export const setAddBuildToFolderModal = (dispatchFolders, bool) => {
	dispatchFolders({
		type: 'SET_FOLDERS',
		payload: { addToFolderModalOpen: bool },
	});
};

/**
 * Handles setting the last selected folder ID in the context
 * @param {function} dispatchFolders - dispatch function
 * @param {bool} bool - true or false
 */
export const setLastSelectedFolder = (dispatchFolders, folderId) => {
	dispatchFolders({
		type: 'SET_FOLDERS',
		payload: { lastSelectedFolderId: folderId },
	});
};

/**
 * handles setting where the folder is currently open
 * @param {function} dispatchFolders - dispatch function
 * @param {string} location - where the folder is currently open (user, popup, profile, upload)
 */
export const setFolderLocation = (dispatchFolders, location) => {
	dispatchFolders({
		type: 'SET_FOLDERS',
		payload: { folderLocation: location },
	});
};

/**
 * handles setting where the folder is currently open
 * @param {function} dispatchFolders - dispatch function
 * @param {arr} folders - a array of users folders to display
 */
export const setUsersFolders = (dispatchFolders, folders) => {
	dispatchFolders({
		type: 'SET_FOLDERS',
		payload: { usersFolders: folders },
	});
};

/**
 * handles setting if the folder view is collapsed or not
 * @param {function} dispatchFolders - dispatch function
 * @param {arr} bool
 */
export const setCollapsedFolders = (dispatchFolders, bool) => {
	dispatchFolders({
		type: 'SET_FOLDERS',
		payload: { collapsedFolders: bool },
	});
};

/**
 * Handles setting the id of the folder to pin on a build
 * @param {function} dispatchFolders - dispatch function
 * @param {string} folderId
 */
export const setPinnedFolder = (dispatchFolders, folderId) => {
	dispatchFolders({
		type: 'setPinnedFolder',
		payload: folderId,
	});
};

/**
 * Handles setting the id of the folder to pin on a build
 * @param {function} dispatchFolders - dispatch function
 * @param {string} folder - the fetched folder
 */
export const setFetchedPinnedFolder = (dispatchFolders, folder) => {
	dispatchFolders({
		type: 'SET_FOLDERS',
		payload: { fetchedPinnedFolder: folder },
	});
};

/**
 * Handles setting the user of the folder we are currently openign
 * @param {function} dispatchFolders - dispatch function
 * @param {string} user - the fetched folder
 */
export const setCurrentFolderOwner = (dispatchFolders, user) => {
	dispatchFolders({
		type: 'SET_FOLDERS',
		payload: { currentFolderOwner: user },
	});
};

/**
 * Handles setting if we are currently saving something to a folder or not
 * @param {function} dispatchFolders - dispatch function
 * @param {bool} savingToFolder
 */
export const setSavingToFolder = (dispatchFolders, savingToFolder) => {
	dispatchFolders({
		type: 'SET_FOLDERS',
		payload: { savingToFolder: savingToFolder },
	});
};
