import React, { useContext, useState } from 'react';
import BuildContext from '../../../../context/build/BuildContext';
import { useCopyBuildToClipboard } from '../../../../context/build/BuildActions';
import Button from '../../../../components/buttons/Button';

/**
 * Button for exporting a build (copying it to the users clipboard)
 * @returns
 */
function ExportBuildBtn() {
	const { loadedBuild } = useContext(BuildContext);
	const { copyBuildToClipboard } = useCopyBuildToClipboard();
	const [fetchingRawBuild, setFetchingRawBuild] = useState(false);

	return <Button color="btn-primary" icon="export" onClick={() => copyBuildToClipboard(setFetchingRawBuild, loadedBuild.id)} text={fetchingRawBuild ? 'Copying...' : `Export to KSP 2`} />;
}

export default ExportBuildBtn;
