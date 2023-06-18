import React, { useContext, useState, useEffect } from 'react';
import BuildInfoCard from '../../../components/cards/BuildInfoCard';
import AuthContext from '../../../context/auth/AuthContext';
import BuildsContext from '../../../context/builds/BuildsContext';
import BotwBadge from '../../../assets/BotW_badge2.png';

/**
 * Displays the users details
 * @returns
 */
function UserDetails() {
	const { openProfile } = useContext(AuthContext);
	const { fetchedBuilds } = useContext(BuildsContext);
	const [dateCreated, setDateCreated] = useState(null);

	useEffect(() => {
		if (openProfile) {
			setDateCreated(new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(openProfile.dateCreated.seconds * 1000));
		}
	}, [openProfile]);

	return (
		<>
			{/* User Details */}
			<div className="flex flex-row flex-wrap gap-2 2k:gap-4 bg-base-900 w-full justify-center p-2 2k:p-4 rounded-xl">
				<BuildInfoCard title="Joined">
					<p className="text-xl 2k:text-3xl text-accent">{dateCreated}</p>
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
