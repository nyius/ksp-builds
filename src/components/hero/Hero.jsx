import React, { useEffect, useState } from 'react';
import { useNewsContext } from '../../context/news/NewsContext';
import { useBuildsContext } from '../../context/builds/BuildsContext';
import PrevSlideBtn from './Buttons/PrevSlideBtn';
import NextSlideBtn from './Buttons/NextSlideBtn';
import HeroList from './Components/HeroList';
import { nextHeroSlide, useSetHeroSlides } from '../../context/news/NewsActions';
import HeroBreadcrumbs from './Components/HeroBreadcrumbs';
import HeroProgressBar from './Components/HeroProgressBar';

const slideTimer = 8000; // time in MS to switch slides
let progressTick = 50; // update every 0.5 seconds

/**
 * Hero at the top of the page
 * @returns
 */
function Hero() {
	const [slides] = useSetHeroSlides(Array.from({ length: 10 }));
	const [progress, setProgress] = useState(0);
	const { dispatchNews } = useNewsContext();
	const [nextSlideInterval, setNextSlideInterval] = useState(null);
	const [progressInterval, setProgressInterval] = useState(null);

	useEffect(() => {
		// console.log(progress);
	}, [progress]);

	// Timer for switching slide
	useEffect(() => {
		const goToNextSlide = setInterval(() => {
			nextHeroSlide(dispatchNews);
			setProgress(0);
		}, slideTimer);

		const updateProgress = setInterval(() => {
			setProgress(prevState => {
				// amount to increment / how many seconds the timer is * 100 to get %
				return prevState + (progressTick / slideTimer) * 100;
			});
		}, progressTick);

		setNextSlideInterval(goToNextSlide);
		setProgressInterval(updateProgress);

		return () => {
			clearInterval(goToNextSlide);
			clearInterval(updateProgress);
		};
	}, []);

	const handleMouseEnterAndPauseTimer = () => {
		clearInterval(nextSlideInterval);
		clearInterval(progressInterval);
	};

	const handleMouseLeaveAndStartTimer = () => {
		const goToNextSlide = setInterval(() => {
			nextHeroSlide(dispatchNews);
			setProgress(0);
		}, slideTimer);

		const updateProgress = setInterval(() => {
			setProgress(prevState => {
				return prevState + (progressTick / slideTimer) * 100;
			});
		}, progressTick);

		setNextSlideInterval(goToNextSlide);
		setProgressInterval(updateProgress);
	};

	const handleRestartTimer = () => {
		setProgress(0);
		clearInterval(nextSlideInterval);
		clearInterval(progressInterval);

		const goToNextSlide = setInterval(() => {
			nextHeroSlide(dispatchNews);
			setProgress(0);
		}, slideTimer);

		const updateProgress = setInterval(() => {
			setProgress(prevState => {
				return prevState + (progressTick / slideTimer) * 100;
			});
		}, progressTick);

		setNextSlideInterval(goToNextSlide);
		setProgressInterval(updateProgress);
	};

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className="flex flex-col items-center mb-10">
			<div className="hero flex flex-row w-full p-4 2k:p-8 rounded-lg justify-center items-center relative">
				<PrevSlideBtn resetTimer={handleRestartTimer} />
				<HeroList slides={slides} />
				<NextSlideBtn resetTimer={handleRestartTimer} />
			</div>
			<HeroProgressBar progress={progress} slideTimer={slideTimer} />
			<HeroBreadcrumbs mouseEnterPauseTimer={handleMouseEnterAndPauseTimer} mouseLeaveRestartTimer={handleMouseLeaveAndStartTimer} />
		</div>
	);
}

export default Hero;
