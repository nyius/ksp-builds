import React, { useContext } from 'react';
import Button from '../../../buttons/Button';
import { setReport } from '../../../../context/auth/AuthActions';
import AuthContext from '../../../../context/auth/AuthContext';

/**
 * Displays the button to report a build
 * @param {obj} build - the build obj to report
 * @returns
 */
function BuildCardReportBtn({ build }) {
	const { dispatchAuth } = useContext(AuthContext);
	return <Button tooltip="Report" htmlFor="report-modal" css="normal-case" color="btn-ghost" text="report" icon="report" onClick={() => setReport(dispatchAuth, 'build', build)} />;
}

export default BuildCardReportBtn;
