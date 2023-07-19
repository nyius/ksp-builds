import React, { useState } from 'react';
import { useAuthContext } from '../../context/auth/AuthContext';
import Button from '../buttons/Button';
import PlanetHeader from '../header/PlanetHeader';
import { setReport } from '../../context/auth/AuthActions';
import { useSubmitReport } from '../../context/auth/AuthActions';

function ReportModal() {
	const [message, setMessage] = useState('');
	const { submitReport } = useSubmitReport();
	const { dispatchAuth, reportingContent } = useAuthContext();

	/**
	 * Handles submitting a report
	 */
	const handleSubmitReport = () => {
		submitReport(message);
	};

	//---------------------------------------------------------------------------------------------------//
	if (reportingContent) {
		return (
			<>
				<input type="checkbox" checked={reportingContent} id="report-modal" className="modal-toggle" />
				<div className="modal">
					<div className="modal-box relative">
						<div className="flex flex-col w-full justify-center">
							<Button htmlFor="report-modal" text="X" position="absolute right-2 top-2 z-50" style="btn-circle" onClick={() => setReport(dispatchAuth, null, null)} />
							<PlanetHeader text="Report" />
							<p className="text-xl 2:text-3xl italic text-slate-400 mb-2">Message(optional)</p>
							<textarea onChange={e => setMessage(e.target.value)} name="" id="" rows="5" placeholder="Leave a message" className="textarea bg-base-600 mb-5 2k:mb-10 text-xl 2k:text-3xl"></textarea>
							<Button htmlFor="report-modal" text="Submit Report" icon="done" color="btn-primary" size="w-full" onClick={handleSubmitReport} />
						</div>
					</div>
				</div>
			</>
		);
	}
}

export default ReportModal;
