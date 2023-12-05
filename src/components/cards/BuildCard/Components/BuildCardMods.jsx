import React from 'react';

/**
 * Displays if a build uses mods or not
 * @param {*} modsUsed
 * @returns
 */
function BuildCardMods({ modsUsed }) {
	return (
		<h3 className="flex flex-col items-center justify-center text-slate-300 text-xl 2k:text-2xl sm:text-lg">
			<span className="text-slate-500 italic"> Uses Mods:</span> {modsUsed ? 'Yes' : 'No'}
		</h3>
	);
}

export default BuildCardMods;
