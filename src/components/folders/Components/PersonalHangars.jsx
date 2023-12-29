import React from 'react';
import Hangar from './Hangar';
import { useHangarContext } from '../../../context/hangars/HangarContext';
import { useHideOwnHangar, useSetPersonalBuildsHangar } from '../../../context/hangars/HangarActions';
import { useAuthContext } from '../../../context/auth/AuthContext';
import CheckCredentials from '../../credentials/CheckCredentials';
import NewHangarBtn from '../Buttons/NewHangarBtn';

/**
 * Displays the logged in users own hangars
 * @returns
 */
function PersonalHangars() {
	const { makingNewHangar, hangarLocation } = useHangarContext();
	const { user } = useAuthContext();
	const [ownBuildsHangar] = useSetPersonalBuildsHangar({ id: 'your-builds', hangarName: 'Your Builds', builds: [], urlName: '' });
	const [hideOwnHangar] = useHideOwnHangar(false);

	//---------------------------------------------------------------------------------------------------//
	if (hangarLocation !== 'user') {
		return (
			<CheckCredentials type="user">
				{!hideOwnHangar ? <Hangar hangar={ownBuildsHangar} editable={false} /> : null}

				{user?.hangars?.map(hangar => {
					return <Hangar key={hangar.id} hangar={hangar} editable={true} />;
				})}

				{makingNewHangar ? <Hangar type="new" /> : null}

				<NewHangarBtn />
			</CheckCredentials>
		);
	}
}

export default PersonalHangars;
