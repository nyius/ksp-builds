import React, { useContext } from 'react';
import Button from '../../../../components/buttons/Button';
import { cloneDeep } from 'lodash';
import BuildContext from '../../../../context/build/BuildContext';
import { useUpdateBuild } from '../../../../context/build/BuildActions';
import FoldersContext from '../../../../context/folders/FoldersContext';
import { useAddBuildToFolder } from '../../../../context/folders/FoldersActions';

/**
 * Button to save a builds update
 * @returns
 */
function UpdateBuildBtn() {
	const { buildToUpload } = useContext(BuildContext);
	const { pinnedFolder } = useContext(FoldersContext);
	const { updateBuild } = useUpdateBuild();
	const { addBuildToFolder } = useAddBuildToFolder();

	/**
	 * Handles a user updatin a build
	 */
	const handleUpdateBuild = async () => {
		const makeReadyBuild = cloneDeep(buildToUpload);
		if (pinnedFolder) makeReadyBuild.pinnedFolder = pinnedFolder;
		await addBuildToFolder(makeReadyBuild.id);
		await updateBuild(makeReadyBuild);
	};

	return <Button type="button" text="Save" icon="save" color="btn-success" onClick={handleUpdateBuild} />;
}

export default UpdateBuildBtn;
