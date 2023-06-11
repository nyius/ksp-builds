import React, { useContext } from 'react';
import Button from '../../../../components/buttons/Button';
import AuthContext from '../../../../context/auth/AuthContext';
import BuildContext from '../../../../context/build/BuildContext';
import { setReport } from '../../../../context/auth/AuthActions';

/**
 * Button for reporting a build
 * @returns
 */
function ReportBuildBtn() {
	const { dispatchAuth } = useContext(AuthContext);
	const { loadedBuild } = useContext(BuildContext);

	//---------------------------------------------------------------------------------------------------//
	return <Button tooltip="Report" htmlFor="report-modal" color="bg-base-800 text-error" icon="report" onClick={() => setReport(dispatchAuth, 'build', loadedBuild)} />;
}

export default ReportBuildBtn;
