import React, { useContext } from 'react';
import useBuilds from '../../context/builds/BuildsActions';
import BuildsContext from '../../context/builds/BuildsContext';
import Spinner1 from '../spinners/Spinner1';
import Button from './Button';

function LoadMoreBuilds() {
	const { loadingBuilds } = useContext(BuildsContext);
	const { fetchMoreBuilds } = useBuilds();

	if (loadingBuilds) {
		return <Spinner1 />;
	} else {
		return <Button text="Load More" icon="down" onClick={() => fetchMoreBuilds(15)} color="btn-primary" />;
	}
}

export default LoadMoreBuilds;
