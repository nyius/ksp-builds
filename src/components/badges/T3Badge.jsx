import React from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import Tier3Badge from '../../assets/badges/tier3/tier3_badge36.png';
import TooltipPopup from '../tooltip/TooltipPopup';

const T3Badge = ({ hideText }) => {
	const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } = usePopperTooltip();

	return (
		<>
			<div ref={setTriggerRef} className="text-accent flex flex-row shrink-0 gap-2 items-center">
				{hideText ? '' : 'Tier 3'}
				<span>
					<img className="w-7 h-7" src={Tier3Badge} alt="tier 3 badge" />
				</span>
			</div>
			<TooltipPopup text="Tier 3" visible={visible} getArrowProps={getArrowProps} getTooltipProps={getTooltipProps} setTooltipRef={setTooltipRef} />
		</>
	);
};

export default T3Badge;
