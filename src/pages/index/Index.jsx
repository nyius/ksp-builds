import React from 'react';
import BuildCard from '../../components/buildCard/BuildCard';
import VerticalLink from './VerticalLink';
import LeftBar from './LeftBar';

function Index() {
	return (
		<div className="flex w-full justify-center">
			<div className="grid grid-cols-6 gap-4 justify-center w-3/4">
				<LeftBar />

				<div className="col-start-2 col-end-6">
					<div className="flex flex-row flex-wrap gap-4 w-full justify-center">
						<BuildCard />
						<BuildCard />
						<BuildCard />
						<BuildCard />
						<BuildCard />
						<BuildCard />
						<BuildCard />
						<BuildCard />
						<BuildCard />
						<BuildCard />
						<BuildCard />
						<BuildCard />
						<BuildCard />
						<BuildCard />
						<BuildCard />
						<BuildCard />
						<BuildCard />
						<BuildCard />
						<BuildCard />
						<BuildCard />
						<BuildCard />
						<BuildCard />
						<BuildCard />
						<BuildCard />
						<BuildCard />
						<BuildCard />
					</div>
				</div>

				<div className="sidebar-right bg-base-400 rounded-xl p-4">Right side!</div>
			</div>
		</div>
	);
}

export default Index;
