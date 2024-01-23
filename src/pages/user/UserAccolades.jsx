import React from 'react';
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';
import HelmetHeader from '../../components/Helmet/Helmet';
import PlanetHeader from '../../components/header/PlanetHeader';
import AccoladeBrowser from '../../components/accolades/AccoladeBrowser';
import { useAuthContext } from '../../context/auth/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetAndSetOpenUserProfile } from '../../context/auth/AuthActions';
import Button from '../../components/buttons/Button';
import AccoladeDetailHeader from '../../components/accolades/AccoladeDetailHeader';

/**
 * Displays the accolade page
 * @returns
 */
function UserAccolades() {
	const { openProfile, fetchingProfile } = useAuthContext();
	const navigate = useNavigate();

	const usersId = useParams().id;
	useGetAndSetOpenUserProfile(usersId);

	//---------------------------------------------------------------------------------------------------//
	if (!fetchingProfile && openProfile) {
		return (
			<>
				<HelmetHeader
					title={openProfile.username}
					pageLink={`https://kspbuilds.com/profile/${openProfile.username}/accolades`}
					description={`Public KSP Builds profile for ${openProfile.username}. View their builds, send a message, and more.`}
				/>

				<MiddleContainer size="w-full lg:w-3/4 justify-self-center">
					<PlanetHeader text={`Accolades`} />
					<Button icon="left2" text="Back to profile" color="btn-ghost" position="self-start" onClick={() => navigate(`/user/${openProfile.username}`)} />

					<AccoladeDetailHeader loading={fetchingProfile} user={openProfile} />

					{!fetchingProfile && openProfile ? <AccoladeBrowser user={openProfile} type="full" /> : ''}
				</MiddleContainer>
			</>
		);
	}
}

export default UserAccolades;
