import React from 'react';

/**
 * How many people run KSP Builds FAQ Card
 * @returns
 */
function HowManyPeople() {
	return (
		<>
			<p className="!text-start p-3">
				Currently just me{' '}
				<span onClick={() => window.open('https://kspbuilds.com/user/nyius', '_blank')} className="link link-accent">
					(u/nyius)
				</span>
				! :)
			</p>
		</>
	);
}

export default HowManyPeople;
