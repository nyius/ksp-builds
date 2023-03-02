import React, { useEffect } from 'react';
import BuildCard from '../../components/buildCard/BuildCard';
import VerticalLink from './VerticalLink';
import LeftBar from './LeftBar';
import useBuilds from '../../context/builds/BuildsActions';
import Builds from './Builds';

function Index() {
	const { fetchBuilds } = useBuilds();

	useEffect(() => {
		fetchBuilds(10);
	}, []);

	return (
		<div className="flex w-full justify-center mb-6">
			<div className="grid grid-cols-6 gap-4 justify-center w-3/4">
				<LeftBar />
				<Builds />
				<div className="sidebar-right bg-base-400 rounded-xl p-4">Right side!</div>
			</div>
		</div>
	);
}

export default Index;
