import { toast } from 'react-toastify';

/**
 * Handles copying the folders URL to clipboard for sharing
 * @param {*} username - a users ID/username.
 * @param {*} folderUrl
 */
export const handleShareFolder = (username, folderUrlName) => {
	if (!folderUrlName) {
		const folderUrl = `kspbuilds.com/user/${username}`;
		navigator.clipboard.writeText(folderUrl);
	} else {
		const folderUrl = `kspbuilds.com/user/${username}/folder/${folderUrlName}`;
		navigator.clipboard.writeText(folderUrl);
		toast.success('Copied URL to clipboard!');
	}
};

/**
 * Checks if a build is in the current users folder
 * @param {string} buildId - ID of build to look for
 * @param {string} folderId - ID of folder to look in
 * @param {obj} user - The current logged in user
 */
export const checkIfBuildInFolder = (buildId, folderId, user) => {
	const folderIndex = user.folders.findIndex(folder => folder.id === folderId);

	if (folderIndex >= 0) {
		return user.folders[folderIndex].builds.includes(buildId);
	}
};

/**
 * Checks if a build is in any of the current users folders
 * @param {string} buildId - ID of build to look for
 * @param {obj} user - The current logged in user
 */
export const checkIfBuildInAllFolders = (buildId, user) => {
	const folderIndex = user?.folders?.findIndex(folder => folder.builds.includes(buildId));

	return folderIndex >= 0;
};

/**
 * Checks if a folder is currently selected. Returns its index position
 * @param {string} folderId - the ID of the folder to check
 * @param {arr} selectedFolders - array of currently selected folders
 */
export const checkIfFolderSelected = (folderId, selectedFolders) => {
	let folderIndex = selectedFolders.findIndex(folder => folder.id === folderId);
	if (folderId === 'your-builds') folderIndex = 1;

	return folderIndex >= 0;
};

/**
 * Checks an array of folders and returns the number of times a name appears
 * @param {arr} folders
 * @param {string} nameToCheck
 * @returns
 */
export const checkForSameNameFolder = (folders, nameToCheck) => {
	let sameNameCount = 0;
	folders.map(folder => {
		if (folder.folderName === nameToCheck) {
			sameNameCount++;
		}
	});
	return sameNameCount;
};
