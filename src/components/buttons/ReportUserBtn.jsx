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

	return (
		<div className="tooltip" data-tip="Report">
			<Button htmlFor="report-modal" color="btn-dark" size="w-full" icon="report" text="Report" onClick={() => setReport(dispatchAuth, 'user', userToReport)} />
		</div>
	);
}

export default ReportUserBtn;
