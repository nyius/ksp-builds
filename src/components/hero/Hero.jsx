import React, { useContext, useEffect, useState, Fragment } from 'react';
import NewsContext from '../../context/news/NewsContext';
import BuildsContext from '../../context/builds/BuildsContext';
import Button from '../buttons/Button';
import ChallengeCard from '../cards/ChallengeCard';
import BuildOfTheWeekCard from '../cards/BuildOfTheWeekCard';
import PrevSlideBtn from './Buttons/PrevSlideBtn';

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

	//---------------------------------------------------------------------------------------------------//
	return (
		<>
			<div className="banner flex flex-row w-full p-4 2k:p-8 bg-base-900 rounded-lg mb-10 items-center relative place-content-between ">
				{!articlesLoading && !loadingBuildOfTheWeek && challenges ? (
					<>
						<PrevSlideBtn currentSlid={currentSlide} setCurrentSlide={setCurrentSlide} slides={slides} />
						<div className="w-full h-full flex flex-col lg:flex-row items-center gap-10 2k:gap-20 ">
							{slides.map((item, i) => {
								return (
									<Fragment key={i}>
										{item.buildOfTheWeek ? <BuildOfTheWeekCard currentSlide={currentSlide} i={i} key={i} buildOfTheWeek={item} /> : <ChallengeCard currentSlide={currentSlide} i={i} key={i} challenge={item} />}
									</Fragment>
								);
							})}
						</div>
						{/* <img src={Planet} className="absolute hidden sm:block inset-x-2/3 inset-y-1/4 w-5/12 z-0" alt="Planet image" /> */}
						<Button icon="right2" size="!h-fit sm:!h-full" onClick={handleNextSlide} position="z-50 absolute sm:relative top-1/4 sm:top-0 right-10 sm:right-0" />
					</>
				) : null}
			</div>
		</>
	);
}

export default Hero;
