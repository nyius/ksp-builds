import React, { useContext } from 'react';
import BuildCard from '../../components/buildCard/BuildCard';
import BuildsContext from '../../context/builds/BuildsContext';
import Spinner1 from '../../components/spinners/Spinner1';

function Builds() {
	const { loadingBuilds, fetchedBuilds, lastFetchedBuild } = useContext(BuildsContext);

	return (
		<div className="col-start-2 col-end-6">
			<div className="flex flex-row flex-wrap gap-4 w-full justify-center mb-6">
				{loadingBuilds ? (
					<div className="flex flex-row w-full justify-center items-center">
						<div className="w-20">
							<Spinner1 />
						</div>
					</div>
				) : (
					<>
						{fetchedBuilds.length === 0 ? (
							<div className="flex flex-row w-full justify-center items-center">
								<p>No builds found :(</p>
							</div>
						) : (
							<>
								{fetchedBuilds.map(build => {
									return <BuildCard build={build} />;
								})}
							</>
						)}
					</>
				)}
			</div>

			{!loadingBuilds && lastFetchedBuild !== 'end' && (
				<div className="flex flex-row w-full justify-center items-center">
					<button className="btn btn-primary">Load More</button>
				</div>
			)}
		</div>
	);
}

export default Builds;
