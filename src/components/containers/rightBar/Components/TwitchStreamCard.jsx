import React from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import TooltipPopup from '../../../tooltip/TooltipPopup';

/**
 * Displays a card for a streamer
 * @param {object} stream
 * @returns
 */
function TwitchStreamCard({ stream }) {
	const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } = usePopperTooltip();

	return (
		<>
			<a target="_blank" href={`https://www.twitch.tv/${stream.user_name}`} ref={setTriggerRef} className="flex flex-row gap-3 2k:gap-4 items-center rounded-lg p-4 cursor-pointer hover:!bg-primary place-content-between">
				<div className="avatar">
					<div className="w-14 rounded-full">
						<img src={stream.thumbnail_url.replace('{width}', '128').replace('{height}', '128')} alt="" />
					</div>
				</div>
				<p className="text-xl 2k:text-2xl text-slate-100 w-5/6 single-line-truncate">{stream.user_name}</p>
				<div className="w-4 h-4 rounded-full bg-red-500"></div>
			</a>
			<TooltipPopup visible={visible} getArrowProps={getArrowProps} getTooltipProps={getTooltipProps} setTooltipRef={setTooltipRef} text={stream.title} />
		</>
	);
}

export default TwitchStreamCard;
