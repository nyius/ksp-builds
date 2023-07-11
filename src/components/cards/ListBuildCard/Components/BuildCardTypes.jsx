import React from 'react';

/**
 * Displays the builds types
 * @param {arr} types
 * @returns
 */
function BuildCardTypes({ types }) {
	return (
		<div className="flex flex-row flex-wrap gap-2 items-center">
			{types.map((type, i) => {
				return (
					<p className="text-lg 2k:text-xl py-1 px-4 rounded-full bg-base-800" key={i}>
						{type}
					</p>
				);
			})}
		</div>
	);
}

export default BuildCardTypes;
