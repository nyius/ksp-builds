import React from 'react';
import { useNavigate } from 'react-router-dom';
import Helmet from '../../components/Helmet/Helmet';
import PlanetHeader from '../../components/header/PlanetHeader';
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';
import useResetStates from '../../hooks/useResetStates';
import { useAuthContext } from '../../context/auth/AuthContext';
import Spinner2 from '../../components/spinners/Spinner2';
import Notifications from './Components/Notifications';
import UsernameColor from './Components/UsernameColor';
import Subscription from './Components/Subscription';
import Messaging from './Components/Messaging';
import Cookies from './Components/Cookies';
import DeleteAccount from './Components/DeleteAccount';

/**
 * Settings Page
 * @returns
 */
function Settings() {
	const navigate = useNavigate();
	const { user, authLoading } = useAuthContext();

	useResetStates();

	//---------------------------------------------------------------------------------------------------//
	if (authLoading) {
		return (
			<MiddleContainer>
				<Spinner2 />
			</MiddleContainer>
		);
	}

	if (!authLoading && !user) {
		navigate('/');
	}

	return (
		<>
			<Helmet title="Settings" pageLink="https://kspbuilds.com/settings" description="View and change settings for your KSP Builds account. Change notifications, manage subscription, username color, and more." />

			<MiddleContainer>
				<PlanetHeader text="Settings" />

				<Notifications />

				<div className="divider"></div>
				<UsernameColor />

				<div className="divider"></div>
				<Subscription />

				<div className="divider"></div>
				<Messaging />

				<div className="divider"></div>
				<Cookies />

				<div className="divider"></div>
				<DeleteAccount />
			</MiddleContainer>
		</>
	);
}

export default Settings;
