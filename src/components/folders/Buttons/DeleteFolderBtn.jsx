import React, { useContext } from 'react';
import FoldersContext from '../../../context/folders/FoldersContext';
import Button from '../../buttons/Button';
import { setDeleteFolder } from '../../../context/folders/FoldersActions';

/**
 * Displays the button for deleting a folder
 * @returns
 */
function DeleteFolderBtn() {
	const { dispatchFolders, openedFolder, folderLocation, addToFolderModalOpen } = useContext(FoldersContext);

	if (openedFolder && (folderLocation !== 'user' || addToFolderModalOpen) && openedFolder.id !== 'your-builds') {
		return <Button tooltip="Delete Folder" color="btn-ghost" icon="delete" onClick={() => setDeleteFolder(dispatchFolders, openedFolder.id, openedFolder.folderName)} />;
	}
}

export default DeleteFolderBtn;
