import React from 'react';
import { useFoldersContext } from '../../../context/folders/FoldersContext';
import Folder from './Folder';
import { useSetPersonalBuildsFolder } from '../../../context/folders/FoldersActions';

/**
 * Displays another users folders
 * @returns
 */
function UsersFolders() {
	const { usersFolders, folderLocation } = useFoldersContext();
	const [usersBuildsFolder] = useSetPersonalBuildsFolder({ id: 'users-builds', folderName: '', builds: [], urlName: '' }); // usersBuildsFolder is for all of the users builds

	if (folderLocation === 'user') {
		return (
			<>
				<Folder folder={usersBuildsFolder} editable={false} />
				{usersFolders?.map(folder => {
					return <Folder key={folder.id} folder={folder} editable={false} />;
				})}
			</>
		);
	}
}

export default UsersFolders;
