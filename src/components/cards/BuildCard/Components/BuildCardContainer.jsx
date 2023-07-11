import React from 'react';

/**
 * Displays the container for the build card
 * @param {*} children
 * @param {obj} build
 * @param {obj} setHover - state setters for hover
 * @param {obj} setHoverAnim - state setters for hover
 * @returns
 */
function BuildCardContainer({ children, build, setHoverAnim, setHover }) {
	const handleHover = state => {
		setHoverAnim(state);

		setTimeout(() => {
			setHover(state);
		}, 100);
	};

	return (
		<div className="flex p-2 2k:p-4 max-w-xl aspect-square md:aspect-5/6 xl:aspect-square 2k:aspect-5/6' shadow-lg hover:shadow-xl w-full relative" onMouseEnter={() => handleHover(build.urlName)} onMouseLeave={() => handleHover(false)}>
			{children}
		</div>
	);
}

export default BuildCardContainer;
