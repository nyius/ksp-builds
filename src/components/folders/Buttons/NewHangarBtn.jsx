import React from 'react';
import { useAuthContext } from '../../../context/auth/AuthContext';
import { useHangarContext } from '../../../context/hangars/HangarContext';
import { setHangarLimitModal, setMakingNewHangar } from '../../../context/hangars/HangarActions';
import { FaPlus } from 'react-icons/fa';
import { useCheckMinSubscriptionTier } from '../../../context/auth/AuthActions';
import TooltipPopup from '../../tooltip/TooltipPopup';
import { usePopperTooltip } from 'react-popper-tooltip';

/**
 * Displays the button for making a new hangar
 * @returns
 */
function NewHangarBtn() {
	const { user } = useAuthContext();
	const { openedHangar, dispatchHangars, hangarView } = useHangarContext();
	const { checkMinSubscriptionTier } = useCheckMinSubscriptionTier();

	const handleMakeNewHangar = () => {
		console.log(user?.hangars?.length);
		if (user?.hangars?.length < 5 || (checkMinSubscriptionTier(1) && user?.hangars?.length < 6)) {
			setMakingNewHangar(dispatchHangars, true);
		} else if (!checkMinSubscriptionTier(1) && user?.hangars?.length === 5) {
			setHangarLimitModal(dispatchHangars, true);
		}
	};

	const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } = usePopperTooltip();

	if (!openedHangar) {
		return (
			<>
				<label
					ref={setTriggerRef}
					className={`text-5xl flex flex-col items-center justify-center cursor-pointer ${hangarView === 'list' ? 'h-fit w-full py-2 bg-base-400 ' : 'h-28 aspect-square'} hover:bg-base-200 rounded-xl`}
					onClick={handleMakeNewHangar}
				>
					<FaPlus />
				</label>
				<TooltipPopup text="New Hangar" getArrowProps={getArrowProps} getTooltipProps={getTooltipProps} setTooltipRef={setTooltipRef} visible={visible} />
			</>
		);
	}
}

export default NewHangarBtn;
