import React from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import TooltipPopup from '../tooltip/TooltipPopup';
import Intercept_Logo from '../../assets/ig_logo_192.png';

const InterceptGamesBadge = ({ hideText, size }) => {
	const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } = usePopperTooltip();

	return (
		<>
			<div ref={setTriggerRef} className="text-primary flex flex-row gap-2 shrink-0 items-center">
				{hideText ? '' : 'Official KSP2 Developer'}
				<span>
					<img className={`${size ? size : 'w-7 h-7'}`} src={Intercept_Logo} alt="tier 1 badge" />
				</span>
			</div>
			<TooltipPopup text="Official KSP2 Developer" visible={visible} getArrowProps={getArrowProps} getTooltipProps={getTooltipProps} setTooltipRef={setTooltipRef} />
		</>
	);
};

export default InterceptGamesBadge;
