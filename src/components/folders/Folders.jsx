import React, { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AuthContext from '../../context/auth/AuthContext';
import FolderNavbar from './Components/FolderNavbar';
import RenameFolderBtn from './Buttons/RenameFolderBtn';
import DeleteFolderBtn from './Buttons/DeleteFolderBtn';
import FolderViewBtn from './Buttons/FolderViewBtn';
import ShareFolderbtn from './Buttons/ShareFolderbtn';
import CollapseFoldersBtn from './Buttons/CollapseFoldersBtn';
import FolderList from './Components/FolderList';
import FoldersContext from '../../context/folders/FoldersContext';
import { setUsersFolders } from '../../context/folders/FoldersActions';

/**
 * handles displaying a users folders
 * @param {bool} hideOwnFolder - if we want to hide the users own folder
 * @returns
 */
function Folders() {
	const location = useLocation();
	let currentUser = location.pathname.split('/')[2];
	const { user, authLoading } = useContext(AuthContext);
	const { folderLocation, dispatchFolders } = useContext(FoldersContext);

	useEffect(() => {
		if (folderLocation !== 'user') {
			setUsersFolders(dispatchFolders, null);
			if (!authLoading && user?.username) {
				if (!currentUser) {
					currentUser = user.username;
				}
			}
		}
	}, [authLoading]);

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className="flex flex-col gap-4 w-full rounded-xl p-6 2k:p-8 bg-base-300 mb-10">
			<div className="flex flex row place-content-between">
				<FolderNavbar currentUser={currentUser} />

				<div className="flex flex-row text-3xl 2k:text-4xl">
					<RenameFolderBtn />
					<DeleteFolderBtn />
					<FolderViewBtn />
					<ShareFolderbtn username={currentUser} />
					<CollapseFoldersBtn />
				</div>
			</div>

			<div className="w-full h-1 border-b-2 border-dashed border-slate-600"></div>

			<FolderList />
		</div>
	);
}

export default Folders;
