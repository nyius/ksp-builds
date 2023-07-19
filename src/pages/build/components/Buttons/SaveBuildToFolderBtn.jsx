import React from 'react';
import Button from '../../../../components/buttons/Button';
import CheckCredentials from '../../../../components/credentials/CheckCredentials';
import { useFoldersContext } from '../../../../context/folders/FoldersContext';
import { setAddBuildToFolderModal, setBuildToAddToFolder, setFolderLocation } from '../../../../context/folders/FoldersActions';
import { checkIfBuildInAllFolders } from '../../../../context/folders/FoldersUtilils';
import { useBuildContext } from '../../../../context/build/BuildContext';
import { useAuthContext } from '../../../../context/auth/AuthContext';

/**
 * Button for saving the current build to a folder
 * @returns
 */
function SaveBuildToFolderBtn() {
	const { dispatchFolders } = useFoldersContext();
	const { user } = useAuthContext();
	const { loadedBuild } = useBuildContext();

	//---------------------------------------------------------------------------------------------------//
	return (
		<CheckCredentials type="user">
			<Button
				onClick={() => {
					setFolderLocation(dispatchFolders, 'popup');
					setBuildToAddToFolder(dispatchFolders, loadedBuild.id, user);
					setAddBuildToFolderModal(dispatchFolders, true);
				}}
				color="btn-secondary"
				text={checkIfBuildInAllFolders(loadedBuild.id, user) ? `Saved` : `Save build to folder`}
				htmlFor="add-build-to-folder-modal"
				icon="save"
			/>
		</CheckCredentials>
	);
}

export default SaveBuildToFolderBtn;
