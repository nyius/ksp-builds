import React from 'react';

/**
 * Displays any information for a build, such as author, date created, etc
 * @param {string} title - the title of the card
 * @param {*} children
 * @returns
 */
function BuildInfoCard({ title, children }) {
	return (
		<div className="flex flex-col gap-2 2k:gap-3 bg-base-400 p-2 lg:p-3 2k:p-5 items-center justify-center rounded-lg">
			<p className="text-lg xl:text-xl 2k:text-2xl text-slate-200">{title}</p>
			{children}
		</div>
	);
}

export default BuildInfoCard;
