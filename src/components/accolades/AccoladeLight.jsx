import React from 'react';
import TooltipPopup from '../tooltip/TooltipPopup';
import { usePopperTooltip } from 'react-popper-tooltip';
import LockedAccolade from '../../assets/Locked-Accolade-500.png';
import { setAccoladeViewer } from '../../context/accolades/AccoladesActions';
import { useAccoladesContext } from '../../context/accolades/AccoladesContext';

/**
 * Handles displaying just the accolade icon, and hover tooltip
 * @param {*} accolade - the accolade to display
 * @param {*} size - size of the accolade image
 * @param {*} type - (optional) "unlocked" for not having a locked image
 * @returns
 */
function AccoladeLight({ accolade, size, type }) {
	const { dispatchAccolades } = useAccoladesContext();
	const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } = usePopperTooltip();

	const openAccolade = () => {
		setAccoladeViewer(dispatchAccolades, accolade);
	};

	return (
		<div className={`flex flex-col justify-center items-center`} onClick={openAccolade}>
			{accolade?.iconSm ? (
				<>
					<img ref={setTriggerRef} src={type === 'unlocked' ? accolade?.iconSm : !accolade.dateReceived ? LockedAccolade : accolade?.iconSm} className={`${size} object-scale-down cursor-pointer`} />
					<div className="text-2xl 2k:text-3xl my-4 2k:my-6 text-slate-300 text-center">{accolade.name}</div>
					<TooltipPopup text={accolade?.tooltip ? accolade?.tooltip : accolade?.name} getArrowProps={getArrowProps} visible={visible} getTooltipProps={getTooltipProps} setTooltipRef={setTooltipRef} />
				</>
			) : null}
		</div>
	);
}

export default AccoladeLight;
