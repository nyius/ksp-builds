import React from 'react';
import { BiComment } from 'react-icons/bi';
import { usePopperTooltip } from 'react-popper-tooltip';
import TooltipPopup from '../../../tooltip/TooltipPopup';

/**
 * displays the builds comment count
 * @param {int} commentCount
 * @returns
 */
function BuildCardComments({ commentCount }) {
	const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } = usePopperTooltip();

	return (
		<>
			<div ref={setTriggerRef} className="flex flex-row items-center gap-2">
				<p className="text-2xl 2k:text-3xl">
					<BiComment />
				</p>
				<p className="text-lg 2k:text-2xl">{commentCount ? commentCount : 0}</p>
			</div>
			<TooltipPopup getArrowProps={getArrowProps} getTooltipProps={getTooltipProps} setTooltipRef={setTooltipRef} visible={visible} text="Comments" />
		</>
	);
}

export default BuildCardComments;
