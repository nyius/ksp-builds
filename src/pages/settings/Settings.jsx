import React, { useEffect } from 'react';
import PlanetHeader from '../../components/header/PlanetHeader';
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';
import useResetStates from '../../utilities/useResetStates';

function Settings() {
	const { resetStates } = useResetStates();

	useEffect(() => {
		resetStates();
	}, []);

	//---------------------------------------------------------------------------------------------------//
	return (
		<MiddleContainer>
			<PlanetHeader text="Settings" />
		</MiddleContainer>
	);
}

export default Settings;
