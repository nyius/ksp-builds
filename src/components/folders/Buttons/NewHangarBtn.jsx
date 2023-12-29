import React from 'react';
import { useAuthContext } from '../../../context/auth/AuthContext';
import { useHangarContext } from '../../../context/hangars/HangarContext';
import { setHangarLimitModal, setMakingNewHangar } from '../../../context/hangars/HangarActions';
import { FaPlus } from 'react-icons/fa';
import { useCheckMinSubscriptionTier } from '../../../context/auth/AuthActions';

/**
 * Displays the button for making a new hangar
 * @returns
 */
function NewHangarBtn() {
	const { user } = useAuthContext();
	const { openedHangar, dispatchHangars, hangarView } = useHangarContext();
	const { checkMinSubscriptionTier } = useCheckMinSubscriptionTier();

	const handleMakeNewHangar = () => {
		if (user?.hangars?.length < 5 || (checkMinSubscriptionTier(1) && user?.hangars?.length < 6)) {
			setMakingNewHangar(dispatchHangars, true);
		} else if (checkMinSubscriptionTier(1) && user?.hangars?.length === 6) {
			setHangarLimitModal(dispatchHangars, true);
		}
	};

	if (!openedHangar) {
		return (
			<div className="tooltip" data-tip="New Hangar">
				<label className={`text-5xl flex flex-col items-center justify-center cursor-pointer ${hangarView === 'list' ? 'h-fit w-full py-2 bg-base-400 ' : 'h-28 aspect-square'} hover:bg-base-200 rounded-xl`} onClick={handleMakeNewHangar}>
					<FaPlus />
				</label>
			</div>
		);
	}
}

export default NewHangarBtn;
