import React from 'react';
import Button from '../../buttons/Button';

/**
 * takes in the current slide and the set state function
 * @param {int} currentSlide - current slide num
 * @param {function} setCurrentSlide - setter function
 * @returns
 */
function NextSlideBtn({ currentSlide, setCurrentSlide, slides }) {
	/**
	 * Handles going to the next slide
	 */
	const handleNextSlide = () => {
		setCurrentSlide(() => {
			if (currentSlide === slides.length - 1) {
				return 0;
			} else {
				return currentSlide + 1;
			}
		});
	};
	return <Button icon="right2" size="!h-fit sm:!h-full" onClick={handleNextSlide} position="z-50 absolute sm:relative top-1/4 sm:top-0 right-10 sm:right-0" />;
}

export default NextSlideBtn;
