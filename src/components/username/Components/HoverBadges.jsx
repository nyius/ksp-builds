import React from 'react';
import BotwBadge from '../../../assets/BotW_badge2.png';
import InterceptGamesBadge from '../../badges/InterceptGamesBadge';
import T1Badge from '../../badges/T1Badge';
import T2Badge from '../../badges/T2Badge';
import T3Badge from '../../badges/T3Badge';
import BotwWinnerBadge from '../../badges/BotwWinnerBadge';

/**
 * Handles displaying a users badges next to their name
 * @param {*} usersProfile - takes in the users profile
 * @returns
 */
function HoverBadges({ usersProfile }) {
	return (
		<div className="flex flex-row gap-2 2k:gap-4 w-full items-end">
			{usersProfile?.username === 'nyius' ? <p className="text-xl 2k:text-2xl text-secondary font-bold">KSP Builds Founder</p> : null}
			{usersProfile?.username === 'interceptgames' ? <InterceptGamesBadge hideText={true} /> : null}
			{usersProfile?.buildOfTheWeekWinner ? <BotwWinnerBadge hideText={true} /> : null}
			{usersProfile?.subscribed === 'tier1' ? <T1Badge hideText={true} /> : null}
			{usersProfile?.subscribed === 'tier2' ? <T2Badge hideText={true} /> : null}
			{usersProfile?.subscribed === 'tier3' ? <T3Badge hideText={true} /> : null}
		</div>
	);
}

export default HoverBadges;
