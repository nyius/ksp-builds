import React, { useEffect, useState } from 'react';
import TooltipPopup from '../tooltip/TooltipPopup';
import { usePopperTooltip } from 'react-popper-tooltip';
import LockedAccolade from '../../assets/Locked-Accolade-500.png';
import { setAccoladeViewer } from '../../context/accolades/AccoladesActions';
import { useAccoladesContext } from '../../context/accolades/AccoladesContext';

/**
 * Handles displaying just the accolade icon, and hover tooltip
 * @param {obj} accolade - the accolade to display
 * @param {string} locked - (optional) "unlocked" for not having a locked image
 * @param {*} size - size of the accolade image (in tailwind syntax)
 * @param {obj} user - The user whose accoaldes to see
 * @param {string} type - "profile", "user", or 'full'
 * @returns
 */
function AccoladeLight({ accolade, size, locked, user, type }) {
	const { dispatchAccolades } = useAccoladesContext();
	const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } = usePopperTooltip();
	const [accoladeCount, setAccoladeCount] = useState(0);

	/**
	 * Handles openining an accolade to view it in popup
	 */
	const openAccolade = () => {
		const usersAccolades = user?.accolades?.filter(userAccolade => userAccolade.id === accolade.id);
		setAccoladeViewer(dispatchAccolades, accolade, usersAccolades);
	};

	/**
	 * Checks if a user has an accolade
	 * @param {string} accoladeId
	 * @returns
	 */
	const checkIfUserHasAccolade = accoladeId => {
		return user?.accolades?.some(userAccolade => userAccolade.id === accoladeId);
	};

	// Count up how many times the user has received this accolade
	useEffect(() => {
		let count = 0;
		if (type === 'full') {
			// Loop over each accolade
			user?.accolades?.map(userAccolade => {
				if (userAccolade.id === accolade.id) count++;
			});
		}

		setAccoladeCount(count);
	}, []);

	if (!checkIfUserHasAccolade(accolade.id) && (type === 'profile' || type === 'user')) return;

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className={`flex flex-col justify-center items-center relative`} onClick={openAccolade}>
			{accoladeCount > 1 ? <div className="absolute flex items-center justify-center text-xl 2k:text-2xl bg-base-600 rounded-full shadow-lg font-black text-slate-200 h-10 w-10 top-0 right-0">{accoladeCount}</div> : ''}
			{accolade?.iconLg ? (
				<>
					<img ref={setTriggerRef} src={locked === 'unlocked' ? accolade?.iconLg : !checkIfUserHasAccolade(accolade.id) ? LockedAccolade : accolade?.iconLg} className={`${size} object-scale-down cursor-pointer`} />
					<div className="text-2xl 2k:text-3xl my-4 2k:my-6 text-slate-300 text-center">{accolade.name}</div>
					<TooltipPopup text={accolade?.tooltip ? accolade?.tooltip : accolade?.name} getArrowProps={getArrowProps} visible={visible} getTooltipProps={getTooltipProps} setTooltipRef={setTooltipRef} />
				</>
			) : (
				''
			)}
		</div>
	);
}

export default AccoladeLight;
