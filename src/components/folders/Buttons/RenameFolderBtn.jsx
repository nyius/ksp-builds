import React from 'react';
import Button from '../../buttons/Button';
import { useFoldersContext } from '../../../context/folders/FoldersContext';
import { setEditingFolder, setEditingFolderName } from '../../../context/folders/FoldersActions';

/**
 *
 * @returns Button for renaming a folder
 */
function RenameFolderBtn() {
	const { dispatchFolders, openedFolder, folderLocation, addToFolderModalOpen } = useFoldersContext();

	// Check that a folder is open, the current location isn't a users page - so we're not renaming someone elses folder, (or if it is and we're in the open folder modal),
	// and that the id of the folder isn't your-builds (so the user can't rename that folder as it's the default folder)
	if (openedFolder && (folderLocation !== 'user' || addToFolderModalOpen) && openedFolder.id !== 'your-builds') {
		return (
			<Button
				tooltip="Rename Folder"
				color="btn-ghost"
				icon="edit"
				onClick={() => {
					setEditingFolder(dispatchFolders, openedFolder);
					setEditingFolderName(dispatchFolders, openedFolder.folderName);
				}}
			/>
		);
	}
}

export default RenameFolderBtn;
