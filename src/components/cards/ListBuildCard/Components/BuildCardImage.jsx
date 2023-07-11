import React from 'react';

/**
 * Displays the builds thumbnail
 * @param {obj} build - the build object
 * @returns
 */
function BuildCardImage({ build }) {
	return (
		<div className="flex h-full w-60 items-center justify-center shrink-0">
			<img src={build.thumbnail ? build.thumbnail : build.images[0]} alt={build.name} loading="lazy" className="h-full object-contain" />
		</div>
	);
}

export default BuildCardImage;
