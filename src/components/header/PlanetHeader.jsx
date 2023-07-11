import React from 'react';
import Planet2 from '../../assets/planet2.png';
import Stars from '../../assets/stars_bg.png';

/**
 * Displays a header with a planet
 * @param {string} text - the text to display
 * @param {*} children
 * @param {*} css - (optional) - any css
 * @returns
 */
function PlanetHeader({ children, text, css }) {
	return (
		<>
			<div className={`flex items-center p-5 w-full relative rounded-2xl overflow-hidden h-20 2k:h-32 bg-base-500 mb-5 2k:mb-10 text-2xl 2k:text-3xl ${css ? css : ''}`}>
				<div className="text-white font-bold pixel-font z-50 w-3/4">{text}</div>
				<img src={Planet2} className="absolute right-0 w-44" alt="" />
				<img src={Stars} className="absolute mix-blend-screen" alt="" />
				{children}
			</div>
		</>
	);
}

export default PlanetHeader;
