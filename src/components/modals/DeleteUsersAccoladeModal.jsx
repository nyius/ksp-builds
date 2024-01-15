import React from 'react';
import Button from '../buttons/Button';
import { increment } from 'firebase/firestore';
import { toast } from 'react-toastify';
import errorReport from '../../utilities/errorReport';
import PlanetHeader from '../header/PlanetHeader';
import { createDateFromFirebaseTimestamp } from '../../utilities/createDateFromFirebaseTimestamp';
import { cloneDeep } from 'lodash';
import { useAccoladesContext } from '../../context/accolades/AccoladesContext';
import { updateUserProfilesAndDb } from '../../context/auth/AuthUtils';
import { useAuthContext } from '../../context/auth/AuthContext';

/**
 * Modal for confirming deleting accolades from a user
 * @param {arr} selectedAccolades - the accolades to delete - an array of objects
 * @param {obj} user - the users whose accolades to delete
 * @param {func} setUserToRemoveAccolade - Function to set the new users state after deleting accolades
 * @param {func} setConfirmDeleteAccolades - function to show/hide this modal
 * @returns
 */
function DeleteUsersAccoladeModal({ selectedAccolades, setSelectedAccolades, user, setUserToRemoveAccolade, setConfirmDeleteAccolades }) {
	const { fetchedAccolades } = useAccoladesContext();
	const { dispatchAuth } = useAuthContext();

	/**
	 * Function that returns the full accoalde from the fetchedAccolades arr
	 * @param {*} accolade
	 * @returns
	 */
	const getFullAccolade = accolade => {
		const fullAccolade = fetchedAccolades.filter(filterAccolade => filterAccolade.id === accolade.id);
		return fullAccolade[0];
	};

	/**
	 * handles deleting a accolade from a user
	 */
	const removeUserAccolades = async () => {
		try {
			// filter the selected accolades from the users own accolades
			const cloneAccolades = cloneDeep(user.accolades);

			const datesInArray2 = new Set(selectedAccolades.map(accoladeSet => accoladeSet.dateReceived.seconds));

			const newAccolades = cloneAccolades.filter(accoladeFilter => !datesInArray2.has(accoladeFilter.dateReceived.seconds));
			await updateUserProfilesAndDb(dispatchAuth, { accolades: newAccolades }, user);

			// Loop over each accolade we want to remove, and remove those rocket reputation points from the user
			selectedAccolades.map(accolade => {
				const fullAccolade = getFullAccolade(accolade);

				updateUserProfilesAndDb(dispatchAuth, { rocketReputation: increment(Number(-fullAccolade.points)) }, user);

				setSelectedAccolades(prevState => {
					const newState = cloneDeep(prevState);
					const foundAccolade = newState.filter(filterAccolade => filterAccolade.dateReceived.seconds === accolade.dateReceived.seconds);
					if (foundAccolade.length > 0) {
						const index = newState.findIndex(accoladeIndex => accoladeIndex.dateReceived.seconds === accolade.dateReceived.seconds);
						newState.splice(index, 1);
						return newState;
					} else {
						return [...prevState, accolade];
					}
				});
			});

			setUserToRemoveAccolade(prevState => {
				return { ...prevState, accolades: newAccolades };
			});

			setConfirmDeleteAccolades(false);

			toast.success('Accolades deleted');
		} catch (error) {
			errorReport(error, false, 'removeUserAccolades');
			toast.error('Something went wrong deleting accolade');
		}
	};

	//---------------------------------------------------------------------------------------------------//
	if (selectedAccolades) {
		return (
			<>
				<input type="checkbox" defaultChecked="true" className="modal-toggle" />
				<div className="modal">
					<div className="modal-box relative">
						<Button style="btn-circle" position="absolute right-2 top-2 z-50" text="X" onClick={() => setConfirmDeleteAccolades(false)} />
						<PlanetHeader text={`Delete users accolade${selectedAccolades.length > 1 ? 's' : ''}`}></PlanetHeader>
						<p className="text-xl 2k:text-3xl text-center mb-4 2k:mb-16">
							Are you sure you want to delete {selectedAccolades.length > 1 ? 'these' : 'this'} accolade{selectedAccolades.length > 1 ? 's' : ''} from <span className="font-bold font-accent">{user.username}</span>?
						</p>
						<div className="flex flex-col gap-4 2k:gap-8 px-10 mb-10">
							{selectedAccolades.map(accolade => {
								return (
									<div key={accolade.dateReceived.seconds + getFullAccolade(accolade).name} className="text-2xl 2k:text-3xl font-bold text-slate-300">
										{getFullAccolade(accolade).name}
										<div className="text-xl 2k:text-2xl italic text-slate-400 font-normal">Received: {createDateFromFirebaseTimestamp(accolade.dateReceived.seconds)}</div>
									</div>
								);
							})}
						</div>
						<div className="flex flex-row items-center justify-center gap-4 2k:gap-10">
							<Button color="btn-success" onClick={removeUserAccolades} text="Delete" icon="delete" />
							<Button color="btn-error" text="Cancel" icon="cancel" onClick={() => setConfirmDeleteAccolades(false)} />
						</div>
					</div>
				</div>
			</>
		);
	}
}

export default DeleteUsersAccoladeModal;
