import React from 'react';

function ImageSlide({ length, image, i }) {
	const slideNum = (i += 1);
	return (
		<div id={`slide${slideNum}`} className="carousel-item relative w-full">
			<img src={image} className="w-full object-scale-down" />
			<div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
				<a href={slideNum === 1 ? `#slide${length}` : `#slide${slideNum - 1}`} className="btn btn-circle 2k:btn-lg 2k:text-4xl bg-base-600 z-100 drop-shadow-lg">
					❮
				</a>
				<a href={slideNum === length ? `#slide1` : `#slide${slideNum + 1}`} className="btn btn-circle 2k:btn-lg 2k:text-4xl bg-base-600 z-100 drop-shadow-lg">
					❯
				</a>
			</div>
		</div>
	);
}

export default ImageSlide;
