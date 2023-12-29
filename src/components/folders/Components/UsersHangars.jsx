import React from 'react';
import { useHangarContext } from '../../../context/hangars/HangarContext';
import Hangar from './Hangar';
import { useSetPersonalBuildsHangar } from '../../../context/hangars/HangarActions';

/**
 * Displays another users hangars
 * @returns
 */
function UsersHangars() {
	const { usersHangars, hangarLocation } = useHangarContext();
	const [usersBuildsHangar] = useSetPersonalBuildsHangar({ id: 'users-builds', hangarName: '', builds: [], urlName: '' }); // usersBuildsHangar is for all of the users builds

	if (hangarLocation === 'user') {
		return (
			<>
				<Hangar hangar={usersBuildsHangar} editable={false} />
				{usersHangars?.map(hangar => {
					return <Hangar key={hangar.id} hangar={hangar} editable={false} />;
				})}
			</>
		);
	}
}

export default UsersHangars;
