import React from 'react';
import Folder from './Folder';
import { useFoldersContext } from '../../../context/folders/FoldersContext';
import { useAuthContext } from '../../../context/auth/AuthContext';
import CheckCredentials from '../../credentials/CheckCredentials';
import NewFolderBtn from '../Buttons/NewFolderBtn';
import { useHideOwnFolder, useSetPersonalBuildsFolder } from '../../../context/folders/FoldersActions';

/**
 * Displays the logged in users own folders
 * @returns
 */
function PersonalFolders() {
	const { makingNewFolder, folderLocation } = useFoldersContext();
	const { user } = useAuthContext();
	const [ownBuildsFolder] = useSetPersonalBuildsFolder({ id: 'your-builds', folderName: 'Your Builds', builds: [], urlName: '' });
	const [hideOwnFolder] = useHideOwnFolder(false);

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
