import React from 'react';
import Button from '../../../../components/buttons/Button';
import { useAuthContext } from '../../../../context/auth/AuthContext';
import { useBuildContext } from '../../../../context/build/BuildContext';
import { setReport } from '../../../../context/auth/AuthActions';

/**
 * Button for reporting a build
 * @returns
 */
function ReportBuildBtn() {
	const { dispatchAuth } = useAuthContext();
	const { loadedBuild } = useBuildContext();

	//---------------------------------------------------------------------------------------------------//
	return <Button tooltip="Report" htmlFor="report-modal" color="bg-base-800 text-error" icon="report" onClick={() => setReport(dispatchAuth, 'build', loadedBuild)} />;
}

export default ReportBuildBtn;
