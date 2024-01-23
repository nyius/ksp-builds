import React from 'react';
import { useAuthContext } from '../../../context/auth/AuthContext';
import { useBuildsContext } from '../../../context/builds/BuildsContext';
import BuildInfoCard from '../../../components/cards/BuildInfoCard';
import { createDateFromFirebaseTimestamp } from '../../../utilities/createDateFromFirebaseTimestamp';

/**
 * Displays the profiles details (joined, uploads, etc)
 * @returns
 */
function ProfileDetails() {
	const { user } = useAuthContext();
	const { fetchedBuilds } = useBuildsContext();

	//---------------------------------------------------------------------------------------------------//
	return (
		<>
			<div className="flex flex-row flex-wrap gap-2 2k:gap-4 bg-base-600 w-full justify-center p-2 2k:p-4 rounded-xl ">
				<BuildInfoCard title="Joined">
					<p className="text-xl 2k:text-2xl text-accent font-bold">{user?.dateCreated ? createDateFromFirebaseTimestamp(user?.dateCreated?.seconds) : 'Today'}</p>
				</BuildInfoCard>
				<BuildInfoCard title="Uploads">
					<p className="text-xl 2k:text-2xl text-accent font-bold">{fetchedBuilds?.length}</p>
				</BuildInfoCard>
				<BuildInfoCard title="Rocket Reputation">
					<p className="text-xl 2k:text-2xl text-accent font-bold">{user.rocketReputation}</p>
				</BuildInfoCard>
				<BuildInfoCard title="Comments">
					<p className="text-xl 2k:text-2xl text-accent font-bold">{user.commentCount}</p>
				</BuildInfoCard>
			</div>
		</>
	);
}

export default ProfileDetails;
