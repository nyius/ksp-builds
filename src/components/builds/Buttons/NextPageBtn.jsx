import React from 'react';
import { useBuildsContext } from '../../../context/builds/BuildsContext';
import useBuilds from '../../../context/builds/BuildsActions';

/**
 * Handles going back a page
 * @returns
 */
function NextPageBtn() {
	const { loadingBuilds, fetchedBuilds, fetchAmount } = useBuildsContext();
	const { fetchMoreBuilds } = useBuilds();

	return (
		<>
			{!loadingBuilds && fetchedBuilds?.length == fetchAmount ? (
				<button
					className="btn btn-lg text-xl 2k:text-2xl"
					onClick={() => {
						window.scrollTo(0, 0);
						fetchMoreBuilds();
					}}
				>
					»
				</button>
			) : null}
		</>
	);
}

export default NextPageBtn;
