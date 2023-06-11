import React from 'react';

/**
 * Displays a FAQ item. Takes in a title, and any children for the content
 * @param {string} title - title of the FAQ card
 * @param {*} children - children to display
 * @returns
 */
function FaqCard({ title, children }) {
	return (
		<div tabIndex={0} className="collapse join-item border border-base-300 bg-base-100 collapse-arrow">
			<div className="collapse-title text-xl 2k:text-3xl text-slate-100">{title}</div>

			<div className="collapse-content text-3xl text-slate-200">
				<div className="divider w-full"></div>
				{children}
			</div>
		</div>
	);
}

export default FaqCard;
