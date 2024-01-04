import React from 'react';
import { useAuthContext } from '../../context/auth/AuthContext';
import Button from './Button';
import { setReport } from '../../context/auth/AuthActions';

/**
 * Button to report a user
 * @returns
 */
function ReportUserBtn({ userToReport }) {
	const { dispatchAuth } = useAuthContext();

	return <Button tooltip="Report" htmlFor="report-modal" color="btn-dark" size="w-fit" icon="report" onClick={() => setReport(dispatchAuth, 'user', userToReport)} />;
}

export default ReportUserBtn;
