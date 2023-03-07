import React from 'react';
import Step1 from '../../assets/gifs/Sequence 01.gif';
import Step2 from '../../assets/how-to-copy-build-2.png';
import Step3 from '../../assets/gifs/Sequence 02.gif';

function HowToCopyBuildModal() {
	return (
		<>
			<input type="checkbox" id="how-to-copy-build-modal" className="modal-toggle" />
			<div className="modal">
				<div className="modal-box relative scrollbar">
					<label htmlFor="how-to-copy-build-modal" className="btn btn-sm 2k:btn-lg 2k:text-2xl btn-circle absolute right-2 top-2">
						✕
					</label>
					<h3 className="text-2xl 2k:text-4xl font-bold text-slate-100 text-center mb-6">How to Copy Build</h3>
					{/* Step 1 */}
					<h4 className="mb-4 text-md 2k:text-3xl text-slate-300">
						<span className="badge 2k:badge-lg 2k:text-3xl 2k:p-5 mr-2">1</span> Select your craft inside of the VAB
					</h4>
					<img className="rounded-2xl mb-6" src={Step1} alt="" />

					{/* Step 2 */}
					<h4 className="text-md 2k:text-3xl text-slate-300 mb-4">
						<span className="badge 2k:badge-lg 2k:text-3xl 2k:p-5 mr-2">2</span> While selected, press <kbd className="kbd">ctrl</kbd>+<kbd className="kbd">c</kbd>
					</h4>
					<img src={Step2} alt="step2" className="rounded-2xl mb-6" />

					{/* Step 3 */}
					<h4 className="text-md 2k:text-3xl text-slate-300 mb-4">
						<span className="badge 2k:badge-lg 2k:text-3xl 2k:p-5 mr-2">3 </span> Paste it here! <kbd className="kbd">ctrl</kbd>+<kbd className="kbd">v</kbd>
					</h4>
					<img className="rounded-2xl mb-6" src={Step3} alt="" />

					<label htmlFor="how-to-copy-build-modal" className="btn 2k:btn-lg 2k:text-2xl btn-primary w-full">
						Done
					</label>
				</div>
			</div>
		</>
	);
}

export default HowToCopyBuildModal;
