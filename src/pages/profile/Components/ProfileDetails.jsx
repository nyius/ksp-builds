import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../../../context/auth/AuthContext';
import BuildsContext from '../../../context/builds/BuildsContext';
import BuildInfoCard from '../../../components/cards/BuildInfoCard';
import BotwBadge from '../../../assets/BotW_badge2.png';

/**
 * Displays the profiles details (joined, total builds, etc)
 * @returns
 */
function ProfileDetails() {
	const { user } = useContext(AuthContext);
	const { fetchedBuilds } = useContext(BuildsContext);
	const [dateCreated, setDateCreated] = useState(null);

	useEffect(() => {
		if (user?.dateCreated) {
			setDateCreated(new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit' }).format(user.dateCreated.seconds * 1000));
		}
	}, []);

	//---------------------------------------------------------------------------------------------------//
	return (
		<>
			<div className="flex flex-row flex-wrap gap-2 2k:gap-4 bg-base-900 w-full justify-center p-2 2k:p-4 rounded-xl">
				<BuildInfoCard title="Joined">
					<p className="text-xl 2k:text-3xl text-accent">{dateCreated}</p>
				</BuildInfoCard>
				<BuildInfoCard title="Total Builds">
					<p className="text-xl 2k:text-3xl text-accent">{fetchedBuilds.length}</p>
				</BuildInfoCard>
				<BuildInfoCard title="Rocket Reputation">
					<p className="text-xl 2k:text-3xl text-accent">{user.rocketReputation}</p>
				</BuildInfoCard>
				{user?.username && user?.buildOfTheWeekWinner && (
					<BuildInfoCard>
						<img src={BotwBadge} alt="" className="w-22 2k:w-44" />
						<p className="text-lg xl:text-2xl 2k:text-3xl font-bold">Build of the Week Winner</p>
					</BuildInfoCard>
				)}
			</div>
		</>
	);
}

export default ProfileDetails;
