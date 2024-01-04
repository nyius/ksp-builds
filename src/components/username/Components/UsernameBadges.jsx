import React from 'react';
import Intercept_Logo from '../../../assets/ig_logo_192.png';
import { BsFillPatchCheckFill } from 'react-icons/bs';
import T1Badge from '../../badges/T1Badge';
import T2Badge from '../../badges/T2Badge';
import T3Badge from '../../badges/T3Badge';
import InterceptGamesBadge from '../../badges/InterceptGamesBadge';

/**
 * Handles displaying a users badges next to their name
 * @param {*} usersProfile - takes in the users profile
 * @returns
 */
function UsernameBadges({ usersProfile }) {
	return (
		<>
			{usersProfile?.username === 'nyius' ? <BsFillPatchCheckFill /> : null}
			{usersProfile?.username === 'interceptgames' ? <InterceptGamesBadge hideText={true} /> : null}
			{usersProfile?.subscribed === 'tier1' ? <T1Badge hideText={true} /> : null}
			{usersProfile?.subscribed === 'tier2' ? <T2Badge hideText={true} /> : null}
			{usersProfile?.subscribed === 'tier3' ? <T3Badge hideText={true} /> : null}
		</>
	);
}

export default UsernameBadges;
