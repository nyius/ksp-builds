import React, { useContext } from 'react';
import Button from '../../../../components/buttons/Button';
import CheckCredentials from '../../../../components/credentials/CheckCredentials';
import FoldersContext from '../../../../context/folders/FoldersContext';
import { setAddBuildToFolderModal, setBuildToAddToFolder } from '../../../../context/folders/FoldersActions';
import { checkIfBuildInAllFolders } from '../../../../context/folders/FoldersUtilils';
import BuildContext from '../../../../context/build/BuildContext';

/**
 * Button for saving the current build to a folder
 * @returns
 */
function SaveBuildToFolderBtn() {
	const { dispatchFolders, user } = useContext(FoldersContext);
	const { loadedBuild } = useContext(BuildContext);

	//---------------------------------------------------------------------------------------------------//
	return (
		<CheckCredentials type="user">
			<Button
				onClick={() => {
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
