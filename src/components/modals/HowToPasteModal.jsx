import React from 'react';
import Step1 from '../../assets/gifs/paste_01.gif';
import Step2 from '../../assets/how-to-paste-build-2.png';
import Step3 from '../../assets/gifs/paste_03.gif';
import Button from '../buttons/Button';

function HowToPasteBuildModal() {
	return (
		<>
			<input type="checkbox" id="how-to-paste-build-modal" className="modal-toggle" />
			<div className="modal">
				<div className="modal-box relative w-fit scrollbar">
					<div className="flex flex-col w-full justify-center">
						<Button htmlFor="how-to-paste-build-modal" text="X" position="absolute right-2 top-2" style="btn-circle" />

						<h3 className="text-2xl 2k:text-4xl font-bold text-slate-100 text-center mb-6">How to Load Build in KSP</h3>
						{/* Step 1 */}
						<h4 className="mb-4 text-xl 2k:text-3xl text-slate-300">
							<span className="badge 2k:badge-lg text-xl 2k:text-3xl p-3 2k:p-5 mr-2">1</span> Press the 'Export to KSP 2 Button'
						</h4>
						<img className="rounded-2xl mb-6" src={Step1} alt="" />

						{/* Step 2 */}
						<h4 className="text-xl 2k:text-3xl text-slate-300 mb-4">
							<span className="badge 2k:badge-lg text-xl 2k:text-3xl p-3 2k:p-5 mr-2">2</span> Load into the VAB in KSP
						</h4>
						<img src={Step2} alt="step2" className="rounded-2xl mb-6" />

						{/* Step 3 */}
						<h4 className="text-xl 2k:text-3xl text-slate-300 mb-4">
							<span className="badge 2k:badge-lg text-xl 2k:text-3xl p-3 2k:p-5 mr-2">3 </span> Paste it! <kbd className="kbd">ctrl</kbd>+<kbd className="kbd">v</kbd>
						</h4>
						<img className="rounded-2xl mb-6" src={Step3} alt="" />

						<Button htmlFor="how-to-paste-build-modal" text="Done" icon="done" color="btn-primary" size="w-full" />
					</div>
				</div>
			</div>
		</>
	);
}

export default HowToPasteBuildModal;
