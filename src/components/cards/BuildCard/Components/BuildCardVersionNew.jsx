import React from 'react';

/**
 * Displays the builds version
 * @param {string} version
 * @returns
 */
function BuildCardVersion({ version }) {
	return (
		<h3 className="flex flex-col items-center justify-center text-slate-300 text-xl 2k:text-2xl sm:text-lg">
			<span className="text-slate-500 italic"> ksp version:</span> {version}
		</h3>
	);
}

export default BuildCardVersion;
