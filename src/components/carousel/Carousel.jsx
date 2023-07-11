import React from 'react';
import ImageSlide from './ImageSlide';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

/**
 * Displays an image carousel
 * @param {arr} images - takes in array of image urls, like ['kspbuilds.com/jim.jpg', 'kspbuilds.com/steve.jpg,']
 * @returns
 */
function Carousel({ images }) {
	const properties = {
		prevArrow: <div className="btn btn-circle 2k:btn-lg 2k:text-4xl text-white bg-base-600 z-100 drop-shadow-lg z-50">❮</div>,
		nextArrow: <div className="btn btn-circle 2k:btn-lg 2k:text-4xl text-white bg-base-600 z-100 drop-shadow-lg z-50">❯</div>,
		duration: 10000,
		indicators: true,
	};

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className="h-full">
			<Slide {...properties}>
				{images.map((image, i) => (
					<ImageSlide key={i} image={image} i={i} />
				))}
			</Slide>
		</div>
	);
}

export default Carousel;
