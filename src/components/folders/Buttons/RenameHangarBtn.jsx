import React from 'react';
import Button from '../../buttons/Button';
import { useHangarContext } from '../../../context/hangars/HangarContext';
import { setEditingHangar, setEditingHangarName } from '../../../context/hangars/HangarActions';

/**
 *
 * @returns Button for renaming a hangar
 */
function RenameHangarBtn() {
	const { dispatchHangars, openedHangar, hangarLocation, addToHangarModalOpen } = useHangarContext();

	// Check that a hangar is open, the current location isn't a users page - so we're not renaming someone elses hangar, (or if it is and we're in the open hangar modal),
	// and that the id of the hangar isn't your-builds (so the user can't rename that hangar as it's the default hangar)
	if (openedHangar && (hangarLocation !== 'user' || addToHangarModalOpen) && openedHangar.id !== 'your-builds') {
		return (
			<Button
				tooltip="Rename Hangar"
				color="btn-ghost"
				icon="edit"
				onClick={() => {
					setEditingHangar(dispatchHangars, openedHangar);
					setEditingHangarName(dispatchHangars, openedHangar.hangarName);
				}}
			/>
		);
	}
}

export default RenameHangarBtn;
