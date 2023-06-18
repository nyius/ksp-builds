import React, { useContext } from 'react';
import { useChangePage } from '../../../context/builds/BuildsActions';
import BuildsContext from '../../../context/builds/BuildsContext';
import useBuilds from '../../../context/builds/BuildsActions';

/**
 * Handles going back a page
 * @returns
 */
function NextPageBtn() {
	const { loadingBuilds, fetchedBuilds, fetchAmount } = useContext(BuildsContext);
	const { fetchMoreBuilds } = useBuilds();

	return (
		<>
			{!loadingBuilds && fetchedBuilds.length == fetchAmount ? (
				<button
					className="btn btn-lg text-xl 2k:text-2xl"
					onClick={() => {
						window.scrollTo(0, 0);
						fetchMoreBuilds(fetchAmount);
					}}
				>
					»
				</button>
			) : null}
		</>
	);
}

export default NextPageBtn;
