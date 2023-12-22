import React from 'react';
import Button from '../../../../components/buttons/Button';
import { cloneDeep } from 'lodash';
import { useBuildContext } from '../../../../context/build/BuildContext';
import { useUpdateBuild } from '../../../../context/build/BuildActions';
import { useFoldersContext } from '../../../../context/folders/FoldersContext';
import { useAddBuildToFolder } from '../../../../context/folders/FoldersActions';

/**
 * Button to save a builds update
 * @returns
 */
function UpdateBuildBtn() {
	const { buildToUpload } = useBuildContext();
	const { pinnedFolder } = useFoldersContext();
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
