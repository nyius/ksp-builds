import React, { useContext } from 'react';
import Button from '../../../../components/buttons/Button';
import { cloneDeep } from 'lodash';
import BuildContext from '../../../../context/build/BuildContext';
import { useUpdateBuild } from '../../../../context/build/BuildActions';

/**
 * Button to save a builds update
 * @returns
 */
function UpdateBuildBtn() {
	const { buildToUpload } = useContext(BuildContext);
	const { updateBuild } = useUpdateBuild();
	/**
	 * Handles a user updatin a build
	 */
	const handleUpdateBuild = async () => {
		const makeReadyBuild = cloneDeep(buildToUpload);
		await updateBuild(makeReadyBuild);
	};

	return <Button type="button" text="Save" icon="save" color="btn-success" onClick={handleUpdateBuild} />;
}

export default UpdateBuildBtn;
