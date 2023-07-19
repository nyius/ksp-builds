import React from 'react';
import FolderNavbar from './Components/FolderNavbar';
import RenameFolderBtn from './Buttons/RenameFolderBtn';
import DeleteFolderBtn from './Buttons/DeleteFolderBtn';
import FolderViewBtn from './Buttons/FolderViewBtn';
import ShareFolderbtn from './Buttons/ShareFolderbtn';
import CollapseFoldersBtn from './Buttons/CollapseFoldersBtn';
import FolderList from './Components/FolderList';
import { useSetCurrentFolderOwner } from '../../context/folders/FoldersActions';

/**
 * handles displaying a users folders
 * @param {bool} hideOwnFolder - if we want to hide the users own folder
 * @returns
 */
function Folders() {
	useSetCurrentFolderOwner();

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className="flex flex-col gap-4 w-full rounded-xl p-6 2k:p-8 bg-base-300 mb-10">
			<div className="flex flex-row place-content-between">
				<FolderNavbar />

				<div className="flex flex-row text-3xl 2k:text-4xl">
					<RenameFolderBtn />
					<DeleteFolderBtn />
					<FolderViewBtn />
					<ShareFolderbtn />
					<CollapseFoldersBtn />
				</div>
			</div>

			<div className="w-full h-1 border-b-2 border-dashed border-slate-600"></div>

			<FolderList />
		</div>
	);
}

export default Folders;
