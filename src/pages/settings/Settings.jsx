import React, { useEffect, useContext } from 'react';
import PlanetHeader from '../../components/header/PlanetHeader';
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';
import useResetStates from '../../utilities/useResetStates';
import Button from '../../components/buttons/Button';
import AuthContext from '../../context/auth/AuthContext';
import useAuth from '../../context/auth/AuthActions';

function Settings() {
	const { resetStates } = useResetStates();
	const { user } = useContext(AuthContext);
	const { setAccountToDelete } = useAuth();

	useEffect(() => {
		resetStates();
	}, []);

	//---------------------------------------------------------------------------------------------------//
	return (
		<MiddleContainer>
			<PlanetHeader text="Settings" />

			<p className="text-xl 2k:text-2xl text-slate-400 italic">Delete Account</p>
			<Button text="Delete Account" htmlFor="delete-account-modal" onClick={() => setAccountToDelete(user.uid)} size="w-fit" icon="delete" color="btn-error" />
		</MiddleContainer>
	);
}

export default Settings;
