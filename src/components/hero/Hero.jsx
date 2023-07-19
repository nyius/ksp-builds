import React, { useEffect, useState } from 'react';
import { useNewsContext } from '../../context/news/NewsContext';
import { useBuildsContext } from '../../context/builds/BuildsContext';
import PrevSlideBtn from './Buttons/PrevSlideBtn';
import NextSlideBtn from './Buttons/NextSlideBtn';
import HeroList from './Components/HeroList';
import { setHeroSlidesLength, useSetHeroSlides } from '../../context/news/NewsActions';

/**
 * Hero at the top of the page
 * @returns
 */
function Hero() {
	const [slides] = useSetHeroSlides([]);
	const { challenges, articlesLoading } = useNewsContext();
	const { loadingBuildOfTheWeek } = useBuildsContext();

	//---------------------------------------------------------------------------------------------------//
	return (
		<>
			<div className="hero flex flex-row w-full p-4 2k:p-8 rounded-lg mb-10 justify-center items-center relative">
				{!articlesLoading && !loadingBuildOfTheWeek && challenges ? (
					<>
						<PrevSlideBtn />
						<HeroList slides={slides} />
						<NextSlideBtn />
					</>
				) : null}
			</div>
		</>
	);
}

export default Hero;
