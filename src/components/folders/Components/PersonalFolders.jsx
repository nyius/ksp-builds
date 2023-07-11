import React, { useContext, useState, useEffect } from 'react';
import Folder from './Folder';
import FoldersContext from '../../../context/folders/FoldersContext';
import AuthContext from '../../../context/auth/AuthContext';
import CheckCredentials from '../../credentials/CheckCredentials';
import NewFolderBtn from '../Buttons/NewFolderBtn';

/**
 * Displays the logged in users own folders
 * @param {bool} hideOwnFolder
 * @returns
 */
function PersonalFolders() {
	const { makingNewFolder, folderLocation } = useContext(FoldersContext);
	const { user, authLoading } = useContext(AuthContext);
	const [ownBuildsFolder, setOwnBuildsFolder] = useState({ id: 'your-builds', folderName: 'Your Builds', builds: [], urlName: '' });
	const [hideOwnFolder, setHideOwnFolder] = useState(false);

	useEffect(() => {
		if (folderLocation === 'popup') {
			setHideOwnFolder(true);
		} else if (folderLocation === 'upload') {
			setHideOwnFolder(false);
		} else if (folderLocation === 'profile') {
			setHideOwnFolder(false);
		} else if (folderLocation === 'user') {
			setHideOwnFolder(true);
		}
	}, [folderLocation]);

	useEffect(() => {
		if (folderLocation !== 'user') {
			if (!authLoading && user?.username) {
				setOwnBuildsFolder(prevState => {
					return {
						...prevState,
						builds: user.builds,
					};
				});
			}
		}
	}, [authLoading]);

	//---------------------------------------------------------------------------------------------------//
	if (folderLocation !== 'user') {
		return (
			<CheckCredentials type="user">
				{!hideOwnFolder ? <Folder folder={ownBuildsFolder} editable={false} /> : null}

				{user?.folders?.map(folder => {
					return <Folder key={folder.id} folder={folder} editable={true} />;
				})}

				{makingNewFolder ? <Folder type="new" /> : null}

				<NewFolderBtn />
			</CheckCredentials>
		);
	}
}

export default PersonalFolders;
