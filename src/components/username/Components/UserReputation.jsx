import React from 'react';

/**
 * Displays the users rocket reputation
 * @param {int} rocketReputation - the reputation to display
 * @returns
 */
function UserReputation({ rocketReputation }) {
	return (
		<p className="text-xl 2k:text-2xl text-slate-400">
			Rocket Reputation: <span className="text-white">{rocketReputation ? rocketReputation : 0}</span>
		</p>
	);
}

export default UserReputation;
