import React from 'react';
import Button from '../../buttons/Button';
import { handleShareHangar } from '../../../context/hangars/HangarUtils';
import { useHangarContext } from '../../../context/hangars/HangarContext';

/**
 * Displays a button for sharing a hangar
 * @returns
 */
function ShareHangarbtn() {
	const { openedHangar, currentHangarOwner } = useHangarContext();

	if (openedHangar) {
		return <Button tooltip="Share Hangar" color="btn-ghost" icon="share" onClick={() => handleShareHangar(currentHangarOwner, openedHangar.urlName)} />;
	}
}

export default ShareHangarbtn;
