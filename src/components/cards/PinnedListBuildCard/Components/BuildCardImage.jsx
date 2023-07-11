import React from 'react';

/**
 * Displays the builds thumbnail
 * @param {obj} build - the build object
 * @returns
 */
function BuildCardImage({ build }) {
	return (
		<div className="avatar">
			<div className="w-24 rounded-lg">
				<img src={build.thumbnail ? build.thumbnail : build.images[0]} alt={build.name} loading="lazy" className="h-full object-contain" />
			</div>
		</div>
	);
}

export default BuildCardImage;
