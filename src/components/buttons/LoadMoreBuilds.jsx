import React, { useContext } from 'react';
import useBuilds from '../../context/builds/BuildsActions';
import BuildsContext from '../../context/builds/BuildsContext';
import Spinner1 from '../spinners/Spinner1';

function LoadMoreBuilds() {
	const { loadingBuilds } = useContext(BuildsContext);
	const { fetchMoreBuilds } = useBuilds();

	if (loadingBuilds) {
		return <Spinner1 />;
	} else {
		return (
			<button onClick={() => fetchMoreBuilds(10)} className="btn btn-primary">
				Load More
			</button>
		);
	}
}

export default LoadMoreBuilds;
