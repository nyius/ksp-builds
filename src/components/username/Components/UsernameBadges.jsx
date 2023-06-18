import React from 'react';
import Tier1Badge from '../../../assets/badges/tier1/tier1_badge36.png';
import Tier2Badge from '../../../assets/badges/tier2/tier2_badge36.png';
import Tier3Badge from '../../../assets/badges/tier3/tier3_badge36.png';
import Intercept_Logo from '../../../assets/ig_logo_192.png';
import { BsFillPatchCheckFill } from 'react-icons/bs';

/**
 * Handles displaying a users badges next to their name
 * @param {*} usersProfile - takes in the users profile
 * @returns
 */
function UsernameBadges({ usersProfile }) {
	return (
		<>
			{usersProfile?.username === 'nyius' ? <BsFillPatchCheckFill /> : null}
			{usersProfile?.username === 'interceptgames' ? (
				<div className="tooltip" data-tip="Official KSP2 Developer">
					<img src={Intercept_Logo} className="w-12" alt="" />
				</div>
			) : null}
			{usersProfile?.subscribed === 'tier1' ? (
				<div className="tooltip" data-tip="Tier 1 Subscriber">
					<img src={Tier1Badge} className="w-8 h-8 drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]" />
				</div>
			) : null}
			{usersProfile?.subscribed === 'tier2' ? (
				<div className="tooltip" data-tip="Tier 2 Subscriber">
					<img src={Tier2Badge} className="w-8 h-8 drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]" />
				</div>
			) : null}
			{usersProfile?.subscribed === 'tier3' ? (
				<div className="tooltip" data-tip="Tier 3 Subscriber">
					<img src={Tier3Badge} className="w-8 h-8 drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]" />
				</div>
			) : null}
		</>
	);
}

export default UsernameBadges;
