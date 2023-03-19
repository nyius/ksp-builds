import React from 'react';

import Button from '../buttons/Button';

function ReportModal() {
	return (
		<>
			<input type="checkbox" id="report-modal" className="modal-toggle" />
			<div className="modal">
				<div className="modal-box relative w-fit scrollbar">
					<div className="flex flex-col w-full justify-center">
						<Button htmlFor="report-modal" text="X" position="absolute right-2 top-2" style="btn-circle" />
						WIP
						<Button htmlFor="report-modal" text="Submit" icon="send" color="btn-primary" size="w-full" />
					</div>
				</div>
			</div>
		</>
	);
}

export default ReportModal;
