import React from 'react';

/**
 * Displays the builds types
 * @param {arr} types
 * @returns
 */
function BuildCardTypes({ types }) {
	return (
		<div className="flex flex-row flex-wrap gap-2 mb-3 2k:mb-6 items-center">
			{types.map((type, i) => {
				return (
					<p className="text-lg 2k:text-xl text-slate-500" key={i}>
						{type}
						{i < types.length - 1 && ','}
					</p>
				);
			})}
		</div>
	);
}

export default BuildCardTypes;
