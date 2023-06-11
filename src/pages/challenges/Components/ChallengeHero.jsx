import React from 'react';

/**
 * Displays the challenge hero on a challenges page
 * @param {obj} challenge - the challenge object
 * @returns
 */
function ChallengeHero({ challenge }) {
	return (
		<div className="flex flex-col lg:flex-row gap-5 2k:gap-10 items-center rounded-lg bg-base-900 mb-5 2k:mb-10 h-fit">
			<img src={challenge.image} alt={challenge.title} className="rounded-lg w-fit lg:max-w-4xl 2k:max-w-7xl shadow-lg" />
			<div className="flex flex-col items-center lg:items-start gap-2 2k:gap-4 mr-5 2k:mr-10">
				<p className="text-4xl 2k:text-5xl font-bold text-center lg:text-left text-white mb-2 2k:mb-4">{challenge.title}</p>
				<p className="text-2xl 2k:text-3xl italic text-center lg:text-left text-slate-500 mb-2 2k:mb-4">{challenge.date}</p>
				{challenge.url ? (
					<p className="text-xl 2k:text-2xl bg-primary rounded-full text-center lg:text-left text-white w-fit px-4 py-2">Official Challenge</p>
				) : (
					<p className="text-xl 2k:text-2xl bg-secondary rounded-full text-center lg:text-left text-white w-fit px-4 py-2">KSPB Challenge</p>
				)}
			</div>
		</div>
	);
}

export default ChallengeHero;
