import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FoldersContext from './FoldersContext';
import AuthContext from '../auth/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { updateUserState } from '../auth/AuthActions';
import { cloneDeep } from 'lodash';
import { db } from '../../firebase.config';
import { profanity } from '@2toad/profanity';
import { buildNameToUrl } from '../../utilities/buildNameToUrl';
import { checkForSameNameFolder, checkIfBuildInFolder } from './FoldersUtilils';
import { setLocalStoredUser } from '../../utilities/userLocalStorage';

/**
 * Hook with functions for adding a new folder
 * @returns
 */
function useAddNewFolder() {
	const { dispatchFolders, newFolderName } = useContext(FoldersContext);
	const { user, dispatchAuth } = useContext(AuthContext);

	/**
	 * Handles making a new folder
	 */
	const handleAddNewFolder = () => {
		if (!newFolderName || newFolderName.trim() === '') {
			setNewFolderName(dispatchFolders, '');
			setMakingNewFolder(dispatchFolders, false);
			return;
		}

		if (newFolderName.length > 50) {
			toast.error('Folder name too long!');
			console.log(`Folder name too long!`);
			return;
		}

		if (profanity.exists(newFolderName)) {
			toast.error('Folder name not acceptable!');
			console.log(`Folder name  not acceptable`);
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
			console.log(urlName);

			const newFolder = { folderName, id, builds: [], urlName };

			updateUserState(dispatchAuth, { folders: user.folders ? [...user.folders, newFolder] : [newFolder] });

			await updateDoc(doc(db, 'users', user.uid), { folders: user.folders ? [...user.folders, newFolder] : [newFolder] });
			await updateDoc(doc(db, 'userProfiles', user.uid), { folders: user.folders ? [...user.folders, newFolder] : [newFolder] });

			toast.success('Folder added!');
		} catch (error) {
			console.log(error);
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
	const { user, dispatchAuth } = useContext(AuthContext);
	const { dispatchFolders, deleteFolderId } = useContext(FoldersContext);

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
			console.log(error);
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
	const { user } = useContext(AuthContext);
	const { dispatchFolders, selectedFolders } = useContext(FoldersContext);
	const { updateAllFolders } = useUpdateFolder();

	/**
	 * handles adding a build to a folder/folders
	 * @param {string} id - id of build to add
	 */
	const addBuildToFolder = async id => {
		try {
			let newFolders = cloneDeep(selectedFolders);
			let usersFolders = cloneDeep(user.folders);

			// Loop over the users folders
			usersFolders.map(folder => {
				// check if this folder contains the build id
				if (folder.builds.includes(id)) {
					// Check if we dont have this folder selected.
					// if its not selected but we found the id, it means the user wants to remove the build from this folder
					const folderIndex = newFolders.findIndex(newFolder => newFolder.id !== 'your-builds' && newFolder.id === folder.id);

					if (folderIndex < 0) {
						const buildIndex = folder.builds.indexOf(id);
						folder.builds.splice(buildIndex, 1);
					}
				} else {
					// if the folder doesnt include the id, check if we have this folder selected. If we do, add it
					const folderIndex = newFolders.findIndex(newFolder => newFolder.id !== 'your-builds' && newFolder.id === folder.id);
					if (folderIndex >= 0) {
						folder.builds.push(id);
					}
				}
			});

			await updateAllFolders(usersFolders);
			setSelectedFolder(dispatchFolders, null);
			setOpenedFolder(dispatchFolders, null);
			setAddBuildToFolderModal(dispatchFolders, false);
			setMakingNewFolder(dispatchFolders, false);
			setNewFolderName(dispatchFolders, null);
		} catch (error) {
			console.log(error);
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
	const { dispatchFolders, makingNewFolder, editingFolder, lastClickTime, selectedFolders, editingFolderName, longClickStart, lastSelectedFolderId, openedFolder } = useContext(FoldersContext);
	const { updateFolder } = useUpdateFolder();
	const { handleAddNewFolder } = useAddNewFolder();
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
	const { user, dispatchAuth } = useContext(AuthContext);

	/**
	 * handles updating a single folder
	 * @param {obj} updatedFolder - the updated folder
	 */
	const updateFolder = async updatedFolder => {
		try {
			const updatedFolderIndex = user.folders.findIndex(folder => folder.id === updatedFolder.id);
			const newFolders = cloneDeep(user.folders);
			if (newFolders[updatedFolderIndex].folderName !== updatedFolder.folderName) {
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
			console.log(error);
			toast.error('Something went wrong, please try again');
		}
	};

	/**
	 * Handles updaing all of the folders ath the same time. takes in an array of all of the folders
	 * @param {arr} newFolders
	 */
	const updateAllFolders = async newFolders => {
		try {
			updateUserState(dispatchAuth, { folders: newFolders });

			await updateDoc(doc(db, 'users', user.uid), { folders: newFolders });
			await updateDoc(doc(db, 'userProfiles', user.uid), { folders: newFolders });
			setLocalStoredUser(user.uid, user);

			toast.success('Saved!');
		} catch (error) {
			console.log(error);
			toast.error('Something went wrong, please try again');
		}
	};

	return { updateFolder, updateAllFolders };
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

//---------------------------------------------------------------------------------------------------//
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
