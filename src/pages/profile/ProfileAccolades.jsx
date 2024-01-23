import React from 'react';
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';
import HelmetHeader from '../../components/Helmet/Helmet';
import PlanetHeader from '../../components/header/PlanetHeader';
import AccoladeBrowser from '../../components/accolades/AccoladeBrowser';
import { useAuthContext } from '../../context/auth/AuthContext';
import Button from '../../components/buttons/Button';
import { useNavigate } from 'react-router-dom';
import AccoladeDetailHeader from '../../components/accolades/AccoladeDetailHeader';

/**
 * Displays the accolade page
 * @returns
 */
function ProfileAccolades() {
	const { user, authLoading } = useAuthContext();
	const navigate = useNavigate();

	//---------------------------------------------------------------------------------------------------//
	return (
		<>
			<HelmetHeader title="Accolades" pagelink="https://kspbuilds.com/profile/accolades" description="View your KSP Builds accolades." />
			<MiddleContainer size="w-full lg:w-3/4 justify-self-center">
				<PlanetHeader text={`Accolades`} />
				<Button icon="left2" text="Back to profile" color="btn-ghost" position="self-start" onClick={() => navigate(`/profile`)} />

				<AccoladeDetailHeader loading={authLoading} user={user} />

				{!authLoading && user ? <AccoladeBrowser user={user} type="full" /> : ''}
			</MiddleContainer>
		</>
	);
}

export default ProfileAccolades;
