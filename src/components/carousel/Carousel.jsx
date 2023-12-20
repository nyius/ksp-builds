import React, { useState } from 'react';
import ImageSlide from './ImageSlide';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import { BsFillArrowLeftCircleFill, BsFillArrowRightCircleFill } from 'react-icons/bs';

const properties = {
	prevArrow: <div className="btn btn-circle 2k:btn-lg 2k:text-4xl text-white bg-base-600 z-100 drop-shadow-lg z-50">❮</div>,
	nextArrow: <div className="btn btn-circle 2k:btn-lg 2k:text-4xl text-white bg-base-600 z-100 drop-shadow-lg z-50">❯</div>,
	duration: 10000,
	indicators: true,
	transitionDuration: 200,
	infinite: true,
	pauseOnHover: true,
};

const imageStyle = {
	backgroundSize: 'contain',
	backgroundPosition: 'center',
	backgroundRepeat: 'no-repeat',
};

/**
 * Displays an image carousel
 * @param {arr} images - takes in array of image urls, like ['kspbuilds.com/jim.jpg', 'kspbuilds.com/steve.jpg,']
 * @returns
 */
function Carousel({ images }) {
	const [currImage, setCurrImage] = useState(0);

	const goForward = () => {
		if (currImage === images.length - 1) {
			setCurrImage(0);
		} else {
			setCurrImage(currImage + 1);
		}
	};

	const goBack = () => {
		if (currImage === 0) {
			setCurrImage(images.length - 1);
		} else {
			setCurrImage(currImage - 1);
		}
	};

	return (
		<div className="h-full border-dashed border-slate-700 border-2 relative">
			{/* ----------------It appears as though the react slideshow plugin is borked---------------- */}
			{/* <Slide {...properties}>
				{images.map((image, i) => (
					<ImageSlide key={i} image={image} i={i} />
				))}
			</Slide> */}
			{images.length > 1 ? (
				<>
					<div onClick={goBack} className="absolute top-1/2 left-6 rounded-full bg-slate-300 hover:border-r-2 hover:bg-slate-200 border-solid border-primary cursor-pointer text-black text-3xl 2k:text-5xl ">
						<BsFillArrowLeftCircleFill />
					</div>
					<div onClick={goForward} className="absolute top-1/2 right-6 rounded-full bg-slate-300 hover:border-l-2 hover:bg-slate-200 border-solid border-primary cursor-pointer text-black text-3xl 2k:text-5xl ">
						<BsFillArrowRightCircleFill />
					</div>
				</>
			) : null}
			<div key={images[currImage]} className="w-full h-full" style={{ ...imageStyle, backgroundImage: `url(${images[currImage]})` }}></div>;
		</div>
	);
}

export default Carousel;
