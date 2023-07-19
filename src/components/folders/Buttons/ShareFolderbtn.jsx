import React from 'react';
import Button from '../../buttons/Button';
import { handleShareFolder } from '../../../context/folders/FoldersUtilils';
import { useFoldersContext } from '../../../context/folders/FoldersContext';

/**
 * Displays a button for sharing a folder
 * @returns
 */
function ShareFolderbtn() {
	const { openedFolder, currentFolderOwner } = useFoldersContext();

	if (openedFolder) {
		return <Button tooltip="Share Folder" color="btn-ghost" icon="share" onClick={() => handleShareFolder(currentFolderOwner, openedFolder.urlName)} />;
	}
}

export default ShareFolderbtn;
