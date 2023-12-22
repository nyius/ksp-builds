import React from 'react';
import HeroCard from '../../cards/HeroCard';

/**
 * The list of cards for the banner
 * @param {arr} slides - an array of objects to create slides from
 * @returns
 */
function HeroList({ slides }) {
	return (
		<div className="w-full h-full flex flex-row lg:flex-row items-center justify-center gap-10 2k:gap-20 relative">
			{slides.map((article, i) => {
				return <HeroCard key={i} cardItem={article} i={i} />;
			})}
		</div>
	);
}

export default HeroList;
