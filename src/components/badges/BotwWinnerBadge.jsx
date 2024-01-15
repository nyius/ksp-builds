import React from 'react';
import BotwBadge from '../../assets/BotW_badge2.png';
import TooltipPopup from '../tooltip/TooltipPopup';
import { usePopperTooltip } from 'react-popper-tooltip';

const BotwWinnerBadge = ({ hideText }) => {
	const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } = usePopperTooltip();

	return (
		<>
			<div ref={setTriggerRef} className="text-primary flex flex-row gap-2 items-center">
				{hideText ? '' : 'Tier 1'}
				<span>
					<img className="w-7 h-7" src={BotwBadge} alt="Build of the Week Winner" />
				</span>
			</div>
			<TooltipPopup text="Build of the Week Winner" visible={visible} getArrowProps={getArrowProps} getTooltipProps={getTooltipProps} setTooltipRef={setTooltipRef} />
		</>
	);
};

export default BotwWinnerBadge;
