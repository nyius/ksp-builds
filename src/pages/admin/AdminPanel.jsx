import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import axios from 'axios';
//---------------------------------------------------------------------------------------------------//
import PlanetHeader from '../../components/header/PlanetHeader';
import MiddleContainer from '../../components/containers/middleContainer/MiddleContainer';
import Stats from './components/Stats';
import UpdatePanel from './components/UpdatePanel/UpdatePanel';
import SendSiteNotification from './components/SendSiteNotification';
import CreateAlert from './components/CreateAlert';
import CreateChallenge from './components/CreateChallenge';
import CreatePatchNote from './components/CreatePatchNote';
import ReportsAndErrors from './components/ReportsAndErrors/ReportsAndErrors';
import CreateArticle from './components/CreateArticle';
import SendNotificationToUser from './components/SendNotificationToUser';

function AdminPanel() {
	// Joram is pretty
	//---------------------------------------------------------------------------------------------------//
	return (
		<>
			<Helmet title="Admin Panel" pageLink="https://kspbuilds.com/admin-panel" description="Admin Panel for KSP Builds" />
			<MiddleContainer>
				<PlanetHeader text="Admin" />

				<Stats />

				<UpdatePanel />

				<SendSiteNotification />

				<SendNotificationToUser />

				<CreateAlert />

				<CreateChallenge />

				<CreateArticle />

				<CreatePatchNote />

				<ReportsAndErrors />
			</MiddleContainer>
		</>
	);
}

export default AdminPanel;
