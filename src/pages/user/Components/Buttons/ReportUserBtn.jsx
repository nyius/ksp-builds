import React, { useContext } from 'react';
import AuthContext from '../../../../context/auth/AuthContext';
import Button from '../../../../components/buttons/Button';
import { setReport } from '../../../../context/auth/AuthActions';

/**
 * Button to report a user
 * @returns
 */
function ReportUserBtn() {
	const { dispatchAuth, fetchedUserProfile } = useContext(AuthContext);

	return (
		<div className="tooltip" data-tip="Report">
			<Button htmlFor="report-modal" color="btn-dark" size="w-full" icon="report" text="Report" onClick={() => setReport(dispatchAuth, 'user', fetchedUserProfile)} />
		</div>
	);
}

export default ReportUserBtn;
