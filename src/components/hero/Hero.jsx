import React, { useContext, useEffect, useState, Fragment } from 'react';
import NewsContext from '../../context/news/NewsContext';
import BuildsContext from '../../context/builds/BuildsContext';
import ChallengeCard from '../cards/ChallengeCard';
import BuildOfTheWeekCard from '../cards/BuildOfTheWeekCard';
import PrevSlideBtn from './Buttons/PrevSlideBtn';
import NextSlideBtn from './Buttons/NextSlideBtn';

/**
 * Hero at the top of the page
 * @returns
 */
function Hero() {
	const [slides, setSlides] = useState([]);
	const [currentSlide, setCurrentSlide] = useState(0);
	const { challenges, articlesLoading } = useContext(NewsContext);
	const { loadingBuildOfTheWeek, buildOfTheWeek } = useContext(BuildsContext);

	// Add build of the week and challenges together
	useEffect(() => {
		if (!loadingBuildOfTheWeek && !articlesLoading) {
			const arr = [...challenges];
			if (buildOfTheWeek) arr.push(buildOfTheWeek);

			// Sort challenges and build of the week together by timestamp
			arr.sort((a, b) => {
				let aDate, bDate;

				aDate = a.buildOfTheWeek ? new Date(a.buildOfTheWeek.seconds * 1000) : new Date(a.date);
				bDate = b.buildOfTheWeek ? new Date(b.buildOfTheWeek.seconds * 1000) : new Date(b.date);

				return aDate < bDate ? 1 : -1;
			});
			setSlides(arr);
		}
	}, [articlesLoading, loadingBuildOfTheWeek]);

	//---------------------------------------------------------------------------------------------------//
	return (
		<>
			<div className="banner flex flex-row w-full p-4 2k:p-8 bg-base-900 rounded-lg mb-10 items-center relative place-content-between">
				{!articlesLoading && !loadingBuildOfTheWeek && challenges ? (
					<>
						<PrevSlideBtn currentSlide={currentSlide} setCurrentSlide={setCurrentSlide} slides={slides} />
						<div className="w-full h-full flex flex-col lg:flex-row items-center gap-10 2k:gap-20 ">
							{slides.map((item, i) => {
								return (
									<Fragment key={i}>
										{item.buildOfTheWeek ? <BuildOfTheWeekCard currentSlide={currentSlide} i={i} key={i} buildOfTheWeek={item} /> : <ChallengeCard currentSlide={currentSlide} i={i} key={i} challenge={item} />}
									</Fragment>
								);
							})}
						</div>
						<NextSlideBtn currentSlide={currentSlide} setCurrentSlide={setCurrentSlide} slides={slides} />
					</>
				) : null}
			</div>
		</>
	);
}

export default Hero;
