import React, { useContext, useEffect, useState } from 'react';
import Button from '../../buttons/Button';
import { handleShareFolder } from '../../../context/folders/FoldersUtilils';
import FoldersContext from '../../../context/folders/FoldersContext';
import AuthContext from '../../../context/auth/AuthContext';

/**
 * Displays a button for sharing a folder
 * @param {string} username - the username of the owner of a folder
 * @returns
 */
function ShareFolderbtn({ username }) {
	const { openedFolder, folderLocation } = useContext(FoldersContext);
	const { user } = useContext(AuthContext);
	const [foundUsername, setFoundUsername] = useState(username);

	useEffect(() => {
		if (folderLocation === 'popup' || folderLocation === 'upload') {
			setFoundUsername(user?.username);
		}
	}, [folderLocation]);

	if (openedFolder) {
		return <Button tooltip="Share Folder" color="btn-ghost" icon="share" onClick={() => handleShareFolder(foundUsername, openedFolder.urlName)} />;
	}
}

export default ShareFolderbtn;
