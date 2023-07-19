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
			<div className="flex flex-row flex-wrap gap-2 2k:gap-4 bg-base-900 w-full justify-center p-2 2k:p-4 rounded-xl">
				<BuildInfoCard title="Joined">
					<p className="text-xl 2k:text-3xl text-accent">{createDateFromFirebaseTimestamp(openProfile?.dateCreated?.seconds)}</p>
				</BuildInfoCard>
				<BuildInfoCard title="Total Builds">
					<p className="text-xl 2k:text-3xl text-accent">{fetchedBuilds.length}</p>
				</BuildInfoCard>
				<BuildInfoCard title="Rocket Reputation">
					<p className="text-xl 2k:text-3xl text-accent">{openProfile.rocketReputation}</p>
				</BuildInfoCard>
				{openProfile?.buildOfTheWeekWinner && (
					<BuildInfoCard>
						<img src={BotwBadge} alt="" className="w-22 2k:w-44" />
						<p className="text-lg xl:text-2xl 2k:text-3xl font-bold">Build of the Week Winner</p>
					</BuildInfoCard>
				)}
			</div>
		</>
	);
}

export default UserDetails;
