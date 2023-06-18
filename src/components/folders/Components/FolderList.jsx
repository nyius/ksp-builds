import React, { useContext } from 'react';
import FoldersContext from '../../../context/folders/FoldersContext';
import UsersFolders from './UsersFolders';
import PersonalFolders from './PersonalFolders';

/**
 * Displays all of a users folders
 * @returns
 */
function FolderList() {
	const { collapsedFolders, folderView } = useContext(FoldersContext);

	//---------------------------------------------------------------------------------------------------//
	if (!collapsedFolders) {
		return (
			<div className={`flex ${folderView === 'grid' ? 'flex-row' : ''} ${folderView === 'list' ? 'flex-col' : ''} flex-wrap gap-2 w-full`}>
				<UsersFolders />
				<PersonalFolders />
			</div>
		);
	}
}

export default FolderList;
