import React from 'react';
import Button from '../../buttons/Button';
import { useHangarContext } from '../../../context/hangars/HangarContext';
import { setHangarView } from '../../../context/hangars/HangarActions';

/**
 * Displays the button for changing the hangar view (grid/list)
 * @returns
 */
function HangarViewBtn() {
	const { dispatchHangars, hangarView } = useHangarContext();

	if (hangarView === 'list') {
		return <Button tooltip="Change to Grid View" color={`btn-ghost ${hangarView === 'grid' ? 'text-white' : ''}`} icon="grid" onClick={() => setHangarView(dispatchHangars, 'grid')} />;
	} else if (hangarView === 'grid') {
		return <Button tooltip="Change to List View" color={`btn-ghost ${hangarView === 'list' ? 'text-white' : ''}`} icon="list" onClick={() => setHangarView(dispatchHangars, 'list')} />;
	}
}

export default HangarViewBtn;
