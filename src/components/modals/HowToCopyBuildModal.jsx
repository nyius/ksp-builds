import React from 'react';
import Step1 from '../../assets/How-to-copy-build-1.png';
import Step2 from '../../assets/how-to-copy-build-2.png';
import Step3 from '../../assets/How-to-copy-build-3.png';
import Button from '../buttons/Button';

function HowToCopyBuildModal() {
	return (
		<>
			<input type="checkbox" id="how-to-copy-build-modal" className="modal-toggle" />
			<div className="modal">
				<div className="modal-box justify-center relative scrollbar">
					<div className="flex flex-col w-full justify-center">
						<Button htmlFor="how-to-copy-build-modal" text="X" position="absolute right-2 top-2" style="btn-circle" />
						<h3 className="text-2xl 2k:text-4xl font-bold text-slate-100 text-center mb-6">How to Copy Build</h3>
						<h3 className="text-xl 2k:text-3xl text-slate-100 text-center mb-6">**This only works for KSP 2**</h3>
						{/* Step 1 */}
						<h4 className="mb-4 text-xl 2k:text-3xl text-slate-300">
							<span className="badge 2k:badge-lg  text-xl 2k:text-3xl p-3 2k:p-5 mr-2">1</span> Select your craft inside of the VAB
						</h4>
						<img className="rounded-2xl mb-6" src={Step1} alt="" />

						{/* Step 2 */}
						<h4 className="text-xl 2k:text-3xl text-slate-300 mb-4">
							<span className="badge 2k:badge-lg  text-xl 2k:text-3xl p-3 2k:p-5 mr-2">2</span> While selected, press <kbd className="kbd">ctrl</kbd>+<kbd className="kbd">c</kbd>
						</h4>
						<img src={Step2} alt="step2" className="rounded-2xl mb-6" />

						{/* Step 3 */}
						<h4 className="text-xl 2k:text-3xl text-slate-300 mb-4">
							<span className="badge 2k:badge-lg text-xl 2k:text-3xl p-3 2k:p-5 mr-2">3 </span> Paste it on the upload build page! <kbd className="kbd">ctrl</kbd>+<kbd className="kbd">v</kbd>
						</h4>
						<img className="rounded-2xl mb-6" src={Step3} alt="" />

						<Button htmlFor="how-to-copy-build-modal" text="Done" color="btn-primary" size="w-full" icon="done" />
					</div>
				</div>
			</div>
		</>
	);
}

export default HowToCopyBuildModal;
