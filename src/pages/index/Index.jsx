import React, { useEffect } from 'react';
import useBuilds from '../../context/builds/BuildsActions';
import Builds from '../../components/builds/Builds';
import useResetStates from '../../utilities/useResetStates';
import { Helmet } from 'react-helmet';

function Index() {
	const { fetchBuilds } = useBuilds();

	const { resetStates } = useResetStates();

	useEffect(() => {
		resetStates();
	}, []);

	return (
		<>
			<Helmet>
				<meta charSet="utf-8" />
				<title>KSP Builds - Home</title>
				<link rel="canonical" href={`https://kspbuilds.com`} />
			</Helmet>
			<Builds />
		</>
	);
}

export default Index;
