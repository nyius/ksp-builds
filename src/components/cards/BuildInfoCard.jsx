import React from 'react';

/**
 * Displays any information for a build, such as author, date created, etc
 * @param {string} title - the title of the card
 * @param {*} children
 * @returns
 */
function BuildInfoCard({ title, children }) {
	return (
		<div className="flex flex-col gap-2 2k:gap-5 bg-base-400 p-2 lg:p-4 2k:p-6 items-center justify-center rounded-lg">
			<p className="text-lg xl:text-2xl 2k:text-3xl text-slate-200">{title}</p>
			{children}
		</div>
	);
}

export default BuildInfoCard;
