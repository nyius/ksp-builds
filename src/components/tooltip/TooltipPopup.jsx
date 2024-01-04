import React from 'react';

/**
 *
 * @param {*} visible -
 * @param {*} setTooltipRef -
 * @param {*} getTooltipProps -
 * @param {*} getArrowProps -
 * @param {*} text - text to dispaly in the popup
 * @param {*} color - popup background and text color
 * @returns
 */
function TooltipPopup({ visible, setTooltipRef, getTooltipProps, getArrowProps, text, css, color }) {
	if (visible && text) {
		return (
			<div ref={setTooltipRef} {...getTooltipProps({ className: `tooltip-container !text-2xl !2k:text-3xl ${color ? color : 'bg-base-600'} !text-slate-300 !border-none !p-4 ${css ? css : ''}` })}>
				<div {...getArrowProps({ className: `tooltip-arrow ${color ? color : '!bg-base-600 '}` })} />
				{text}
			</div>
		);
	}
}

export default TooltipPopup;
