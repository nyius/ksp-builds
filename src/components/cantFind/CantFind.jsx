import React from 'react';
import PlanetExplosion from '../../assets/planet_explosion.png';
import Button from '../buttons/Button';

/**
 *  Displays the component for when we cant find something (a build, a profile, etc)
 * @param {*} text
 * @param {*} btnText - text int he button
 * @param {*} btnAction - action when the button is clicked
 * @param {*} btnColor - button color
 * @returns
 */
function CantFind({ children, text }) {
	return (
		<div className="col-start-1 col-end-4 2k:col-end-5 flex flex-col gap-4 w-full h-fit rounded-xl p-12 2k:p-12 justify-center items-center">
			<h1 className="text-2xl 2k:text-4xl font-bold bg-base-900 p-4 px-8 rounded-xl">{text}</h1>
			{children}

			<img className="w-1/2" src={PlanetExplosion} alt="Crashed Spaceship" />
		</div>
	);
}

export default CantFind;
