import React from 'react';
import BuildInfoCard from '../../../components/cards/BuildInfoCard';
import { useAuthContext } from '../../../context/auth/AuthContext';
import { useBuildsContext } from '../../../context/builds/BuildsContext';
import BotwBadge from '../../../assets/BotW_badge2.png';
import { createDateFromFirebaseTimestamp } from '../../../utilities/createDateFromFirebaseTimestamp';

/**
 * Displays the users details
 * @returns
 */
function UserDetails() {
	const { openProfile } = useAuthContext();
	const { fetchedBuilds } = useBuildsContext();

	return (
		<>
			{/* User Details */}
			<div className="flex flex-row flex-wrap gap-2 2k:gap-4 bg-base-600 w-full h-1/4 justify-center p-2 2k:p-4 rounded-xl">
				<BuildInfoCard title="Joined">
					<p className="text-xl 2k:text-3xl text-accent">{createDateFromFirebaseTimestamp(openProfile?.dateCreated?.seconds)}</p>
				</BuildInfoCard>
				<BuildInfoCard title="Uploads">
					<p className="text-xl 2k:text-3xl text-accent">{fetchedBuilds.length}</p>
				</BuildInfoCard>
				<BuildInfoCard title="Rocket Reputation">
					<p className="text-xl 2k:text-3xl text-accent">{openProfile.rocketReputation}</p>
				</BuildInfoCard>
			</div>
		</>
	);
}

export default UserDetails;
