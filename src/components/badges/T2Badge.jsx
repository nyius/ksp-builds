import React from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import Tier2Badge from '../../assets/badges/tier2/tier2_badge36.png';
import TooltipPopup from '../tooltip/TooltipPopup';

const T2Badge = ({ hideText }) => {
	const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } = usePopperTooltip();

	return (
		<>
			<div ref={setTriggerRef} className="text-secondary flex flex-row gap-2 shrink-0 items-center">
				{hideText ? '' : `Tier 2`}
				<span>
					<img className="w-7 h-7" src={Tier2Badge} alt="tier 2 badge" />
				</span>
			</div>
			<TooltipPopup text="Tier 2" visible={visible} getArrowProps={getArrowProps} getTooltipProps={getTooltipProps} setTooltipRef={setTooltipRef} />
		</>
	);
};

export default T2Badge;
