import React from 'react';
import Button from '../../buttons/Button';
import { setCollapsedHangars } from '../../../context/hangars/HangarActions';
import { useHangarContext } from '../../../context/hangars/HangarContext';

/**
 * Displays the button for collapsing hangars.
 * @returns
 */
function CollapseHangarsBtn() {
	const { dispatchHangars, collapsedHangars } = useHangarContext();

	return <Button tooltip="Collapse Hangars" color="btn-ghost" icon={`${collapsedHangars ? 'down2' : 'up2'}`} onClick={() => setCollapsedHangars(dispatchHangars, !collapsedHangars)} />;
}

export default CollapseHangarsBtn;
