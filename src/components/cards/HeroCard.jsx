import React, { useState, useEffect, useLayoutEffect } from 'react';
import BuildOfTheWeekCard from './BuildOfTheWeekCard';
import ChallengeCard from './ChallengeCard';
import HeroNewsCard from './HeroNewsCard';
import { useNewsContext } from '../../context/news/NewsContext';
import DefaultChallengeImg from '../../assets/defaultChallenge.png';
import HeroCardContainer from '../hero/Components/HeroCardContainer';

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
			<HeroCardContainer link={getCardUrl(cardItem)} bgImage={cardItem && getCardImage(cardItem)}>
				{cardItem ? (
					<>{cardItem.buildOfTheWeek ? <BuildOfTheWeekCard i={i} buildOfTheWeek={cardItem} /> : <> {cardItem.type === 'challenge' ? <ChallengeCard i={i} challenge={cardItem} /> : <HeroNewsCard i={i} article={cardItem} />}</>}</>
				) : (
					''
				)}
			</HeroCardContainer>
		);
	} else if ((currentHeroSlide === i - 1 || (currentHeroSlide === heroSlidesLength - 1 && i === 0)) && window.innerWidth > 1024) {
		return <HeroCardBackEl i={i} cardItem={cardItem} css="!-translate-x-1/4 !scale-90 !z-30 " opacity="opacity-60" />;
	} else if ((currentHeroSlide === i - 2 || (currentHeroSlide === heroSlidesLength - 2 && i === 0)) && window.innerWidth > 3000) {
		return <HeroCardBackEl i={i} cardItem={cardItem} css="!-translate-x-5p !scale-75 !z-20 " opacity="opacity-40" />;
	} else if ((currentHeroSlide === i + 1 || (currentHeroSlide === 0 && i === heroSlidesLength - 1)) && window.innerWidth > 1024) {
		return <HeroCardBackEl i={i} cardItem={cardItem} css="!-translate-x-3/4 !scale-90 !z-30 " opacity="opacity-60" />;
	} else if ((currentHeroSlide === i + 2 || (currentHeroSlide === 0 && i === heroSlidesLength - 2)) && window.innerWidth > 3000) {
		return <HeroCardBackEl i={i} cardItem={cardItem} css="!-translate-x-95p !scale-75 !z-20 " opacity="opacity-40" />;
	}
}

export default HeroCard;

/**
 * The background card elements
 * @param {*} i
 * @param {*} cardItem
 * @param {*} css
 * @param {*} opacity
 * @returns
 */
const HeroCardBackEl = ({ i, cardItem, css, opacity }) => {
	return (
		<HeroCardContainer link={getCardUrl(cardItem)} style={{ pointerEvents: 'none' }} css={`!h-full !bg-base-900 ${css}`} bgImage={cardItem && getCardImage(cardItem)}>
			<div className={`w-full h-full bg-black rounded-lg flex gap-4 p-4 flex-col lg:flex-row ${opacity}`}>
				{cardItem ? (
					<>{cardItem.buildOfTheWeek ? <BuildOfTheWeekCard i={i} buildOfTheWeek={cardItem} /> : <> {cardItem.type === 'challenge' ? <ChallengeCard i={i} challenge={cardItem} /> : <HeroNewsCard i={i} article={cardItem} />}</>}</>
				) : (
					''
				)}
			</div>
		</HeroCardContainer>
	);
};

/**
 * Gets the image of the card depending on the article type
 * @param {*} card
 * @returns
 */
const getCardImage = card => {
	if (card?.type === 'challenge') {
		if (card.image) return card.image;
		return DefaultChallengeImg;
	} else if (card?.buildOfTheWeek === '') {
		if (card.image) return card.image;
		return DefaultChallengeImg;
	} else {
		if (card.image) return card.image;
		return 'https://firebasestorage.googleapis.com/v0/b/kspbuilds.appspot.com/o/kspbuilds_update_default.png?alt=media&token=daa83171-d7f5-4292-b89c-b15ff06b31c6';
	}
};

/**
 * Gets the URL of the card
 * @param {*} card
 * @returns
 */
const getCardUrl = card => {
	if (card?.type === 'challenge') {
		return `/challenges/${card?.articleId}`;
	} else if (card?.url) {
		return card.url;
	} else {
		return `/news/${card?.articleId}`;
	}
};
