import React from 'react';
import ImageSlide from './ImageSlide';

function Carousel({ images }) {
	return (
		<div className="carousel w-full border-dashed border-2 bg-base-500 border-slate-700 rounded-lg ">
			{images.map((image, i) => {
				return <ImageSlide key={i} length={images.length} image={image} i={i} />;
			})}
		</div>
	);
}

export default Carousel;
