import React, { useContext, useEffect, useState } from 'react';
import BuildContext from '../../../context/build/BuildContext';
import AuthContext from '../../../context/auth/AuthContext';
import { setFetchingProfile, useFetchUser } from '../../../context/auth/AuthActions';
import Builds from '../../../components/builds/Builds';
import useBuilds, { setBuildsForcedView } from '../../../context/builds/BuildsActions';
import BuildsContext from '../../../context/builds/BuildsContext';
import PlanetHeader from '../../../components/header/PlanetHeader';
import { setFetchedPinnedFolder, setPinnedFolder } from '../../../context/folders/FoldersActions';
import FoldersContext from '../../../context/folders/FoldersContext';

/**
 * Displays a builds pinned folder if it has one set
 * @returns
 */
function BuildPinnedFolder() {
	const [fetchedFolder, setFetchedFolder] = useState(null);
	const { loadingBuild, loadedBuild } = useContext(BuildContext);
	const { dispatchFolders } = useContext(FoldersContext);
	const { dispatchBuilds } = useContext(BuildsContext);
	const { dispatchAuth } = useContext(AuthContext);
	const { fetchUsersProfile, checkIfUserInContext } = useFetchUser();
	const { fetchBuildsById } = useBuilds();

	useEffect(() => {
		setBuildsForcedView(dispatchBuilds, 'pinnedList');
	}, []);

	useEffect(() => {
		if (loadingBuild) return;
		setPinnedFolder(dispatchFolders, loadedBuild?.pinnedFolder);
	}, [loadingBuild, loadedBuild]);

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
					console.log('Couldnt find folder from user in context');
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
					.catch(err => {
						console.log(err);
						setFetchingProfile(dispatchAuth, false);
					});
			}
		}
	}, [loadedBuild, loadingBuild]);

	if (!loadingBuild && loadedBuild?.pinnedFolder && fetchedFolder) {
		return (
			<div className="bg-base-900 rounded-lg w-full h-58rem 2k:h-70rem px-4 py-6 2k:py-8 2k:px-6 overflow-auto scrollbar">
				<PlanetHeader css="!text-xl 2k:!text-2xl" text={fetchedFolder.folderName} />

				<Builds />
			</div>
		);
	}
}

export default BuildPinnedFolder;
