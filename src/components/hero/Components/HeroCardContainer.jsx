import React from 'react';

/**
 * The container for the hero card
 * @param {*} css
 * @param {*} style
 * @param {*} link
 * @param {*} bgImage
 * @param {*} children
 * @returns
 */
function HeroCardContainer({ css, style, link, bgImage, children }) {
	return (
		<a
			href={link ? link : ''}
			style={{ ...style, backgroundImage: `url(${bgImage})` }}
			className={`${
				css ? css : ''
			} relative bg-no-repeat border-4 border-solid border-transparent hover:border-primary bg-cover lg:absolute hero-card h-fit lg:h-full flex flex-col lg:flex-row rounded-lg gap-4 bg-base-900 left-1/2 -translate-x-1/2 z-50 shadow-xl`}
		>
			{children}
		</a>
	);
}

export default HeroCardContainer;
