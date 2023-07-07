import React, { useContext, useEffect, useState } from 'react';
import NewsContext from '../../context/news/NewsContext';
import BuildsContext from '../../context/builds/BuildsContext';
import PrevSlideBtn from './Buttons/PrevSlideBtn';
import NextSlideBtn from './Buttons/NextSlideBtn';
import HeroList from './Components/HeroList';
import { setHeroSlidesLength } from '../../context/news/NewsActions';

/**
 * Hero at the top of the page
 * @returns
 */
function Hero() {
	const [slides, setSlides] = useState([]);
	const { challenges, articles, articlesLoading, dispatchNews } = useContext(NewsContext);
	const { loadingBuildOfTheWeek, buildOfTheWeek } = useContext(BuildsContext);

	// Add build of the week and challenges together
	useEffect(() => {
		if (!loadingBuildOfTheWeek && !articlesLoading) {
			const fullNewsArr = [...challenges, ...articles];
			if (buildOfTheWeek) fullNewsArr.push(buildOfTheWeek);

			// Sort everything
			fullNewsArr.sort((a, b) => {
				let aDate, bDate;

				aDate = a.buildOfTheWeek ? new Date(a.buildOfTheWeek.seconds * 1000) : new Date(a.date);
				bDate = b.buildOfTheWeek ? new Date(b.buildOfTheWeek.seconds * 1000) : new Date(b.date);

				return aDate < bDate ? 1 : -1;
			});

			const newsArr = fullNewsArr.slice(0, 10);

			setHeroSlidesLength(dispatchNews, newsArr.length);
			setSlides(newsArr);
		}
	}, [articlesLoading, loadingBuildOfTheWeek]);

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
