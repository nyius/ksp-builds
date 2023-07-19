import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { setOpenedFolder, useResetOpenFolder } from '../../../context/folders/FoldersActions';
import { useFoldersContext } from '../../../context/folders/FoldersContext';
import useBuilds from '../../../context/builds/BuildsActions';
import { useAuthContext } from '../../../context/auth/AuthContext';
import { FaFolder } from 'react-icons/fa';

/**
 * Displays the breadcrumb navbar above the folders list
 * @param {string} currentUser - takes in the users username (to use for sharing link generation)
 * @returns
 */
function FolderNavbar() {
	const { dispatchFolders, openedFolder, currentFolderOwner } = useFoldersContext();
	const { openProfile, user } = useAuthContext();
	const { fetchBuildsById } = useBuilds();

	const navigate = useNavigate();
	const location = useLocation();
	let currentLocation = location.pathname.split('/')[1];

	useResetOpenFolder();

	return (
		<div className="text-xl 2k:text-2xl breadcrumbs">
			<ul>
				<li
					onClick={() => {
						setOpenedFolder(dispatchFolders, null);
						if (currentLocation === 'user') {
							navigate(`/user/${currentFolderOwner}`);
							fetchBuildsById(openProfile.builds, openProfile.uid, 'user');
						} else if (currentLocation === 'profile') {
							fetchBuildsById(user.builds, user.uid, 'user');
						}
					}}
				>
					<a className="flex flex-row gap-2">
						<FaFolder /> {currentFolderOwner === user?.username ? 'Your Folders' : `${currentFolderOwner}'s Folders`}
					</a>
				</li>
				{openedFolder ? (
					<li>
						<a className="flex flex-row gap-2">
							<FaFolder /> {openedFolder.folderName}
						</a>
					</li>
				) : null}
			</ul>
		</div>
	);
}

export default FolderNavbar;
