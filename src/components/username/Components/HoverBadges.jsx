import React from 'react';
import Tier1Badge from '../../../assets/badges/tier1/tier1_badge36.png';
import Tier2Badge from '../../../assets/badges/tier2/tier2_badge36.png';
import Tier3Badge from '../../../assets/badges/tier3/tier3_badge36.png';
import Intercept_Logo from '../../../assets/ig_logo_192.png';
import BotwBadge from '../../../assets/BotW_badge2.png';

/**
 * Handles displaying a users badges next to their name
 * @param {*} usersProfile - takes in the users profile
 * @returns
 */
function HoverBadges({ usersProfile }) {
	return (
		<div className="flex flex-row gap-2 2k:gap-4 w-full items-end">
			{usersProfile?.username === 'nyius' ? <p className="text-xl 2k:text-2xl text-secondary font-bold">KSP Builds Founder</p> : null}
			{usersProfile?.username === 'interceptgames' ? (
				<div className="tooltip" data-tip="Official KSP2 Developer">
					<img src={Intercept_Logo} className="w-22" alt="" />
				</div>
			) : null}
			{usersProfile?.buildOfTheWeekWinner ? (
				<div className="tooltip" data-tip="Build of the Week Winner">
					<img src={BotwBadge} alt="" className="w-22" />
				</div>
			) : null}
			{usersProfile?.subscribed === 'tier1' ? (
				<div className="tooltip" data-tip="Tier 1 Subscriber">
					<img src={Tier1Badge} alt="" className="w-22" />
				</div>
			) : null}
			{usersProfile?.subscribed === 'tier2' ? (
				<div className="tooltip" data-tip="Tier 2 Subscriber">
					<img src={Tier2Badge} alt="" className="w-22" />
				</div>
			) : null}
			{usersProfile?.subscribed === 'tier3' ? (
				<div className="tooltip" data-tip="Tier 3 Subscriber">
					<img src={Tier3Badge} alt="" className="w-22" />
				</div>
			) : null}
		</div>
	);
}

export default HoverBadges;
