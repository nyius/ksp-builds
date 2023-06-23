import React, { useContext } from 'react';
import { setReport } from '../../../context/auth/AuthActions';
import AuthContext from '../../../context/auth/AuthContext';

/**
 * Displays the report button for a comment
 * @param {*} comment
 * @returns
 */
function CommentReportBtn({ comment }) {
	const { dispatchAuth } = useContext(AuthContext);

	//---------------------------------------------------------------------------------------------------//
	if (comment.comment !== 'deleted') {
		return (
			<label htmlFor="report-modal" className="text-slate-400 hover:text-blue-300 cursor-pointer 2k:text-2xl" onClick={() => setReport(dispatchAuth, 'comment', comment)}>
				Report
			</label>
		);
	}
}

export default CommentReportBtn;
