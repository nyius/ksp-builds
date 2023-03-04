import React, { useEffect } from 'react';
import LeftBar from './LeftBar';
import RightBar from './RightBar';
import useBuilds from '../../context/builds/BuildsActions';
import Builds from './Builds';

function Index() {
	const { fetchBuilds } = useBuilds();

	useEffect(() => {
		fetchBuilds(10);
	}, []);

	return <Builds />;
}

export default Index;
