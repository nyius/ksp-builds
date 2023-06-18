import React from 'react';

/**
 * Displays a badge for a builds 'type' like Rocket, Probe, Etc
 * @param {string} type
 * @returns
 */
function TypeBadge({ type }) {
	return <div className="badge bg-base-600 text-slate-300 p-4 2k:p-5 text-xl 2k:text-2xl sm:text-lg !z-0">{type}</div>;
}

export default TypeBadge;
