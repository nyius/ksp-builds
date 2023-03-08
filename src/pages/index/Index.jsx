import React, { useEffect } from 'react';
import LeftBar from '../../components/containers/leftBar/LeftBar';
import RightBar from '../../components/containers/rightBar/RightBar';
import useBuilds from '../../context/builds/BuildsActions';
import Builds from './Builds';

function Index() {
	const { fetchBuilds } = useBuilds();

	useEffect(() => {
		fetchBuilds();
	}, []);

	return <Builds />;
}

export default Index;
