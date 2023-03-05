import React, { useEffect } from 'react';
import LeftBar from '../../components/leftBar/LeftBar';
import RightBar from './RightBar';
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
