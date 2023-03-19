import React from 'react';
import Button from '../buttons/Button';
import PlanetHeader from '../header/PlanetHeader';

function ReportModal() {
	return (
		<>
			<input type="checkbox" id="report-modal" className="modal-toggle" />
			<div className="modal">
				<div className="modal-box relative w-fit scrollbar">
					<div className="flex flex-col w-full justify-center">
						<Button htmlFor="report-modal" text="X" position="absolute right-2 top-2 z-50" style="btn-circle" />
						<PlanetHeader text="Report" />
						<p className="text-xl 2:text-3xl italic text-slate-400">Message(optional)</p>
						<textarea name="" id="" rows="5" placeholder="Leave a message" className="textarea bg-base-600 mb-5 2k:mb-10"></textarea>
						<Button htmlFor="report-modal" text="Submit Report" icon="send" color="btn-primary" size="w-full" />
					</div>
				</div>
			</div>
		</>
	);
}

export default ReportModal;
