import React, { useContext } from 'react';
import { useChangePage } from '../../../context/builds/BuildsActions';
import BuildsContext from '../../../context/builds/BuildsContext';

/**
 * Handles going back a page
 * @returns
 */
function PrevPageBtn() {
	const { goBackPage } = useChangePage();
	const { loadingBuilds, currentPage } = useContext(BuildsContext);

	return (
		<>
			{!loadingBuilds && currentPage > 0 ? (
				<button
					className="btn btn-lg text-xl 2k:text-2xl"
					onClick={() => {
						window.scrollTo(0, 0);
						goBackPage(currentPage - 1);
					}}
				>
					«
				</button>
			) : null}
		</>
	);
}

export default PrevPageBtn;
