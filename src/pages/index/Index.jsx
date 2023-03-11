import React, { useEffect } from 'react';
import useBuilds from '../../context/builds/BuildsActions';
import Builds from './Builds';
import useResetStates from '../../utilities/useResetStates';

function Index() {
	const { fetchBuilds } = useBuilds();

	const { resetStates } = useResetStates();

	useEffect(() => {
		resetStates();

		fetchBuilds();
	}, []);

	return <Builds />;
}

export default Index;
