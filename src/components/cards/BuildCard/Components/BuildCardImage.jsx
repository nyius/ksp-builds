import React from 'react';

/**
 * Displays the builds image. uses Either the thumbnail or the first image it can find
 * @param {*} build
 * @returns
 */
function BuildCardImage({ build }) {
	return (
		<div className="flex relative w-full items-center bg-base-600 justify-center min-h-[130px] aspect-video rounded-t-xl">
			<img src={build.thumbnail ? build.thumbnail : build.images[0]} alt={build.name} loading="lazy" />
		</div>
	);
}

export default BuildCardImage;
