import React from 'react';
import Button from '../../buttons/Button';

/**
 * takes in the current slide and the set state function
 * @param {int} currentSlide - current slide num
 * @param {function} setCurrentSlide - setter function
 * @returns
 */
function PrevSlideBtn({ currentSlide, setCurrentSlide, slides }) {
	/**
	 * Handles going to the next slide
	 */
	const handlePrevSlide = () => {
		setCurrentSlide(() => {
			if (currentSlide === 0) {
				return slides.length - 1;
			} else {
				return currentSlide - 1;
			}
		});
	};
	return <Button icon="left2" size="!h-fit sm:!h-full" onClick={handlePrevSlide} position="z-60 absolute sm:relative top-1/4 sm:top-0 left-10 sm:left-0" />;
}

export default PrevSlideBtn;
