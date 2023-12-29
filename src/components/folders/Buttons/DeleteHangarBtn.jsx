import React from 'react';
import { useHangarContext } from '../../../context/hangars/HangarContext';
import { setDeleteHangar } from '../../../context/hangars/HangarActions';
import Button from '../../buttons/Button';

/**
 * Displays the button for deleting a hangar
 * @returns
 */
function DeleteHangarBtn() {
	const { dispatchHangars, openedHangar, hangarLocation, addToHangarModalOpen } = useHangarContext();

	if (openedHangar && (hangarLocation !== 'user' || addToHangarModalOpen) && openedHangar.id !== 'your-builds') {
		return <Button tooltip="Delete Hangar" color="btn-ghost" icon="delete" onClick={() => setDeleteHangar(dispatchHangars, openedHangar.id, openedHangar.hangarName)} />;
	}
}

export default DeleteHangarBtn;
