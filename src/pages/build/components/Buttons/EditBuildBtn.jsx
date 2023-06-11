import React, { useContext } from 'react';
import Button from '../../../../components/buttons/Button';
import BuildContext from '../../../../context/build/BuildContext';
import { setEditingBuild } from '../../../../context/build/BuildActions';

/**
 * Button for editing a build
 * @returns
 */
function EditBuildBtn() {
	const { dispatchBuild, loadedBuild } = useContext(BuildContext);

	return <Button tooltip="Edit Build" icon="edit" color="btn-info" onClick={() => setEditingBuild(dispatchBuild, loadedBuild)} />;
}

export default EditBuildBtn;
