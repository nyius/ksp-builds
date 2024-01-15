import React from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import Tier1Badge from '../../assets/badges/tier1/tier1_badge36.png';
import TooltipPopup from '../tooltip/TooltipPopup';

const T1Badge = ({ hideText }) => {
	const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } = usePopperTooltip();

	return (
		<>
			<div ref={setTriggerRef} className="text-primary flex flex-row gap-2 shrink-0 items-center">
				{hideText ? '' : 'Tier 1'}
				<span>
					<img className="w-7 h-7" src={Tier1Badge} alt="tier 1 badge" />
				</span>
			</div>
			<TooltipPopup text="Tier 1" visible={visible} getArrowProps={getArrowProps} getTooltipProps={getTooltipProps} setTooltipRef={setTooltipRef} />
		</>
	);
};

export default T1Badge;
