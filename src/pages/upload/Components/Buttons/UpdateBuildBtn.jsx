import React from 'react';
import Button from '../../../../components/buttons/Button';
import { cloneDeep } from 'lodash';
import { useBuildContext } from '../../../../context/build/BuildContext';
import { useUpdateBuild } from '../../../../context/build/BuildActions';
import { useHangarContext } from '../../../../context/hangars/HangarContext';
import { useAddBuildToHangar } from '../../../../context/hangars/HangarActions';

/**
 * Button to save a builds update
 * @returns
 */
function UpdateBuildBtn() {
	const { buildToUpload } = useBuildContext();
	const { pinnedHangar } = useHangarContext();
	const { updateBuild } = useUpdateBuild();
	const { addBuildToHangar } = useAddBuildToHangar();

	/**
	 * Handles a user updatin a build
	 */
	const handleUpdateBuild = async () => {
		const makeReadyBuild = cloneDeep(buildToUpload);
		if (pinnedHangar) makeReadyBuild.pinnedHangar = pinnedHangar;
		await addBuildToHangar(makeReadyBuild.id);
		await updateBuild(makeReadyBuild);
	};

	return <Button type="button" text="Save" icon="save" color="btn-success" onClick={handleUpdateBuild} />;
}

export default UpdateBuildBtn;
