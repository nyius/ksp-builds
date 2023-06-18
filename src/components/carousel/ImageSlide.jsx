import React from 'react';

/**
 * Displays a slide image.
 * @param {str} image - image url
 * @param {i} i - index, used for Key
 * @returns
 */
function ImageSlide({ image, i }) {
	const imageStyle = {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundSize: 'contain',
		backgroundPosition: 'center',
		backgroundRepeat: 'no-repeat',
		aspectRatio: '16/9',
	};

	//---------------------------------------------------------------------------------------------------//
	return (
		<div key={i}>
			<div className="w-full border-dashed border-2 border-slate-700 rounded-lg bg-base-500" style={{ ...imageStyle, backgroundImage: `url(${image})` }}></div>
		</div>
	);
}

export default ImageSlide;
