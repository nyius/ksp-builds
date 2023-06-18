import React, { useContext, useState, useEffect } from 'react';
import FoldersContext from '../../../context/folders/FoldersContext';
import AuthContext from '../../../context/auth/AuthContext';
import Folder from '../Folder';
import { buildNameToUrl } from '../../../utilities/buildNameToUrl';

/**
 * Displays another users folders
 * @returns
 */
function UsersFolders() {
	const { usersFolders, folderLocation } = useContext(FoldersContext);
	const { openProfile, fetchingProfile } = useContext(AuthContext);
	const [usersBuildsFolder, setUsersBuildsFolder] = useState({ id: 'users-builds', folderName: '', builds: [], urlName: '' }); // usersBuildsFolder is for all of the users builds

	useEffect(() => {
		if (folderLocation === 'user') {
			if (!fetchingProfile && openProfile) {
				setUsersBuildsFolder(prevState => {
					return {
						...prevState,
						builds: openProfile.builds,
						folderName: `${openProfile.username}'s Builds`,
						id: `${buildNameToUrl(openProfile.username)}s-builds`,
						urlName: `${buildNameToUrl(openProfile.username)}s-builds`,
					};
				});
			}
		}
	}, [fetchingProfile, openProfile]);

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
