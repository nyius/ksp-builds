import React, { useState, useEffect, useLayoutEffect } from 'react';
import BuildOfTheWeekCard from './BuildOfTheWeekCard';
import ChallengeCard from './ChallengeCard';
import HeroNewsCard from './HeroNewsCard';
import { useNewsContext } from '../../context/news/NewsContext';

let inputTimeout;

/**
 * Wrapper for a hero card
 * @param {obj} cardItem - the item for the card
 * @param {int} i - the current item in the array
 * @returns
 */
function HeroCard({ cardItem, i }) {
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const { currentHeroSlide, heroSlidesLength } = useNewsContext();

	useLayoutEffect(() => {
		const updateSize = () => {
			setWindowWidth(window.innerWidth);
		};
		window.addEventListener('resize', updateSize);
		updateSize();
		return () => window.removeEventListener('resize', updateSize);
	}, []);

	if (currentHeroSlide === i) {
		return (
			<div className={`relative lg:absolute hero-card h-fit lg:h-full flex flex-col lg:flex-row rounded-lg p-4 gap-4 bg-base-900 left-1/2 -translate-x-1/2 z-50 shadow-xl`}>
				{cardItem.buildOfTheWeek ? <BuildOfTheWeekCard i={i} buildOfTheWeek={cardItem} /> : <> {cardItem.type === 'challenge' ? <ChallengeCard i={i} challenge={cardItem} /> : <HeroNewsCard i={i} article={cardItem} />}</>}
			</div>
		);
	} else if ((currentHeroSlide === i - 1 || (currentHeroSlide === heroSlidesLength - 1 && i === 0)) && window.innerWidth > 1024) {
		return <HeroCardBackEl i={i} cardItem={cardItem} css="-translate-x-1/4 scale-90 z-30" opacity="opacity-60" />;
	} else if ((currentHeroSlide === i - 2 || (currentHeroSlide === heroSlidesLength - 2 && i === 0)) && window.innerWidth > 3000) {
		return <HeroCardBackEl i={i} cardItem={cardItem} css="-translate-x-5p scale-75" opacity="opacity-40" />;
	} else if ((currentHeroSlide === i + 1 || (currentHeroSlide === 0 && i === heroSlidesLength - 1)) && window.innerWidth > 1024) {
		return <HeroCardBackEl i={i} cardItem={cardItem} css="-translate-x-3/4 scale-90 z-30" opacity="opacity-60" />;
	} else if ((currentHeroSlide === i + 2 || (currentHeroSlide === 0 && i === heroSlidesLength - 2)) && window.innerWidth > 3000) {
		return <HeroCardBackEl i={i} cardItem={cardItem} css="-translate-x-95p scale-75" opacity="opacity-40" />;
	}
}

export default HeroCard;

const HeroCardBackEl = ({ i, cardItem, css, opacity }) => {
	return (
		<div tabIndex={1} style={{ pointerEvents: 'none' }} className={`relative lg:absolute hero-card h-full rounded-lg bg-base-900 left-1/2 ${css}`}>
			<div className={`w-full h-full bg-black rounded-lg flex gap-4 p-4 flex-col lg:flex-row ${opacity}`}>{cardItem.buildOfTheWeek ? <BuildOfTheWeekCard i={i} buildOfTheWeek={cardItem} /> : <ChallengeCard i={i} challenge={cardItem} />}</div>
		</div>
	);
};
