import React from 'react';
import Button from '../../../../components/buttons/Button';
import CheckCredentials from '../../../../components/credentials/CheckCredentials';
import { useHangarContext } from '../../../../context/hangars/HangarContext';
import { setAddBuildToHangarModal, setBuildToAddToHangar, setHangarLocation } from '../../../../context/hangars/HangarActions';
import { checkIfBuildInAllHangars } from '../../../../context/hangars/HangarUtils';
import { useBuildContext } from '../../../../context/build/BuildContext';
import { useAuthContext } from '../../../../context/auth/AuthContext';

/**
 * Button for saving the current build to a hangar
 * @returns
 */
function SaveBuildToHangarBtn() {
	const { dispatchHangars } = useHangarContext();
	const { user } = useAuthContext();
	const { loadedBuild } = useBuildContext();

	//---------------------------------------------------------------------------------------------------//
	return (
		<CheckCredentials type="user">
			<Button
				onClick={() => {
					setHangarLocation(dispatchHangars, 'popup');
					setBuildToAddToHangar(dispatchHangars, loadedBuild.id, user);
					setAddBuildToHangarModal(dispatchHangars, true);
				}}
				color="btn-secondary"
				text={checkIfBuildInAllHangars(loadedBuild.id, user) ? `Saved` : `Save build to hangar`}
				htmlFor="add-build-to-hangar-modal"
				icon="save"
			/>
		</CheckCredentials>
	);
}

export default SaveBuildToHangarBtn;
