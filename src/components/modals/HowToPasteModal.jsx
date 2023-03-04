import React from 'react';
import Step1 from '../../assets/gifs/paste_01.gif';
import Step2 from '../../assets/how-to-paste-build-2.png';
import Step3 from '../../assets/gifs/paste_03.gif';

function HowToPasteBuildModal() {
	return (
		<>
			<input type="checkbox" id="how-to-paste-build-modal" className="modal-toggle" />
			<div className="modal">
				<div className="modal-box relative scrollbar">
					<label htmlFor="how-to-paste-build-modal" className="btn btn-sm btn-circle absolute right-2 top-2">
						✕
					</label>
					<h3 className="text-2xl font-bold text-slate-100 text-center mb-6">How to Load Build in KSP</h3>
					{/* Step 1 */}
					<h4 className="mb-4 text-md text-slate-300">
						<span className="badge mr-2">1</span> Press the 'Export to KSP 2 Button'
					</h4>
					<img className="rounded-2xl mb-6" src={Step1} alt="" />

					{/* Step 2 */}
					<h4 className="text-md text-slate-300 mb-4">
						<span className="badge mr-2">2</span> Load into the VAB in KSP
					</h4>
					<img src={Step2} alt="step2" className="rounded-2xl mb-6" />

					{/* Step 3 */}
					<h4 className="text-md text-slate-300 mb-4">
						<span className="badge mr-2">3 </span> Paste it! <kbd className="kbd">ctrl</kbd>+<kbd className="kbd">v</kbd>
					</h4>
					<img className="rounded-2xl mb-6" src={Step3} alt="" />

					<label htmlFor="how-to-paste-build-modal" className="btn btn-primary w-full">
						Done
					</label>
				</div>
			</div>
		</>
	);
}

export default HowToPasteBuildModal;
