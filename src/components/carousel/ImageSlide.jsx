import React from 'react';

const imageStyle = {
	backgroundSize: 'contain',
	backgroundPosition: 'center',
	backgroundRepeat: 'no-repeat',
};

/**
 * Displays a slide image.
 * @param {str} image - image url
 * @param {i} i - index, used for Key
 * @returns
 */
function ImageSlide({ key, image, i }) {
	return <div className="border-dashed border-2 border-slate-700 rounded-lg bg-base-500 w-full h-58rem 2k:h-70rem" style={{ ...imageStyle, backgroundImage: `url(${image})` }}></div>;
}

export default ImageSlide;
