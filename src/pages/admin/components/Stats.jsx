import { collection, getCountFromServer } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../../../firebase.config';
import Spinner2 from '../../../components/spinners/Spinner2';
import SectionContainer from './SectionContainer';

function Stats() {
	const [stats, setStats] = useState(null);
	const [statsLoading, setStatsLoading] = useState(true);

	useEffect(() => {
		const fetchAdminPanel = async () => {
			try {
				const bildsColl = collection(db, 'builds');
				const buildsSnap = await getCountFromServer(bildsColl);
				const usersCol = collection(db, 'users');
				const usersSap = await getCountFromServer(usersCol);

				setStats({ builds: buildsSnap.data().count, users: usersSap.data().count });
				setStatsLoading(false);
			} catch (error) {
				console.log(error);
			}
		};

		fetchAdminPanel();
	}, []);

	return (
		<SectionContainer sectionName="Stats">
			{statsLoading ? (
				<Spinner2 />
			) : (
				<>
					<div className="flex flex-col gap-4 2k:gap-8 p-4 2k:p-8">
						<div className="text-2xl 2k:text-4xl text-slate-400 font-bold">USERS</div>
						<div className="text-2xl 2k:text-4xl ">{stats.users}</div>
					</div>
					<div className="divider divider-horizontal"></div>
					<div className="flex flex-col gap-4 2k:gap-8 p-4 2k:p-8">
						<div className="text-2xl 2k:text-4xl text-slate-400 font-bold">BUILDS</div>
						<div className="text-2xl 2k:text-4xl ">{stats.builds}</div>
					</div>
				</>
			)}
		</SectionContainer>
	);
}

export default Stats;
