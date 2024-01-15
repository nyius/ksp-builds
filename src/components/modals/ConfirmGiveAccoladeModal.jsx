import React from 'react';
import Button from '../buttons/Button';
import PlanetHeader from '../header/PlanetHeader';
import AccoladeFull from '../accolades/AccoladeFull';
import { giveAccoladeAndNotify } from '../../hooks/useGiveAccolade';
import errorReport from '../../utilities/errorReport';
import { useAuthContext } from '../../context/auth/AuthContext';

/**
 * Modal for confirming giving user a accolade
 * @returns
 */
function ConfirmGiveAccoladeModal({ giveAccolade, foundUser, selectedAccolade, setGiveAccolade }) {
	const { dispatchAuth } = useAuthContext();

	const handleGiveAccolade = async () => {
		try {
			await giveAccoladeAndNotify(dispatchAuth, [selectedAccolade], foundUser, setGiveAccolade);
		} catch (error) {
			errorReport(error.message, false, 'handleGiveAccolade');
			console.log(error);
		}
	};

	//---------------------------------------------------------------------------------------------------//
	if (giveAccolade) {
		return (
			<>
				<input type="checkbox" defaultChecked="true" className="modal-toggle" />
				<div className="modal">
					<div className="modal-box relative">
						<Button style="btn-circle" position="absolute right-2 top-2 z-50" text="X" onClick={() => setGiveAccolade(false)} />
						<PlanetHeader text="Give accolade" />
						<p className="text-xl 2k:text-3xl text-slate-200 text-center mb-4 2k:mb-16">
							Are you sure you want to give <span className="font-bold text-accent"> {foundUser.username}</span> the accolade <span className="font-bold"> "{selectedAccolade.name}</span>"?
						</p>

						<div className="w-full p-5 2k:p-7 border-1 border-dashed border-slate-500 mb-6 rounded-xl">
							<AccoladeFull accolade={selectedAccolade} />
						</div>

						<div className="flex flex-row items-center justify-center gap-4 2k:gap-10">
							<Button color="btn-primary" onClick={handleGiveAccolade} text="Give" icon="save" />
							<Button color="btn-error" text="Cancel" icon="cancel" onClick={() => setGiveAccolade(false)} />
						</div>
					</div>
				</div>
			</>
		);
	}
}

export default ConfirmGiveAccoladeModal;
