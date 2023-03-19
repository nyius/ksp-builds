import React, { useContext, useState } from 'react';
import NewsContext from '../../context/news/NewsContext';
import Button from '../buttons/Button';
import { useNavigate } from 'react-router-dom';
import Planet from '../../assets/planet2.png';
import ChallengeCard from '../challenges/ChallengeCard';

function Banner() {
	const [currentSlide, setCurrentSlide] = useState(0);
	const navigate = useNavigate();
	const { challenges, articlesLoading } = useContext(NewsContext);

	/**
	 * Handles going to the next slide
	 */
	const handleNextSlide = () => {
		setCurrentSlide(() => {
			if (currentSlide === challenges.length - 1) {
				return 0;
			} else {
				return currentSlide + 1;
			}
		});
	};
	/**
	 * Handles going to the next slide
	 */
	const handlePrevSlide = () => {
		setCurrentSlide(() => {
			if (currentSlide === 0) {
				return challenges.length - 1;
			} else {
				return currentSlide - 1;
			}
		});
	};

	//---------------------------------------------------------------------------------------------------//
	return (
		<>
			{!articlesLoading && challenges && (
				<div className="banner flex flex-row w-full p-4 2k:p-8 bg-base-900 rounded-lg mb-10 overflow-hidden relative place-content-between ">
					<Button icon="left2" size="h-44 !h-fit sm:!h-full" onClick={handlePrevSlide} position="z-60 absolute sm:relative top-1/2 sm:top-0 left-10 sm:left-0" />
					<div className="w-full h-full flex flex-col sm:flex-row items-center gap-10 2k:gap-20 ">
						{challenges.map((challenge, i) => {
							return <ChallengeCard currentSlide={currentSlide} i={i} key={i} challenge={challenge} />;
						})}
					</div>
					<img src={Planet} className="absolute hidden sm:block inset-x-2/3 inset-y-1/4 w-5/12" alt="Planet image" />
					<Button icon="right2" size="h-44 !h-fit sm:!h-full" onClick={handleNextSlide} position="z-50 absolute sm:relative top-1/2 sm:top-0 right-10 sm:right-0" />
				</div>
			)}
		</>
	);
}

export default Banner;
