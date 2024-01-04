import React from 'react';
import { FiDownload } from 'react-icons/fi';
import TooltipPopup from '../../../tooltip/TooltipPopup';
import { usePopperTooltip } from 'react-popper-tooltip';

/**
 * Displays a bilds download count
 * @param {int} downloads
 * @returns
 */
function BuildCardDownloads({ downloads }) {
	const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } = usePopperTooltip();

	return (
		<>
			<div ref={setTriggerRef} className="flex flex-row items-center gap-2">
				<p className="text-2xl 2k:text-3xl">
					<FiDownload />
				</p>
				<p className="text-lg 2k:text-2xl">{downloads}</p>
			</div>
			<TooltipPopup getArrowProps={getArrowProps} getTooltipProps={getTooltipProps} setTooltipRef={setTooltipRef} visible={visible} text="Downloads" />
		</>
	);
}

export default BuildCardDownloads;
