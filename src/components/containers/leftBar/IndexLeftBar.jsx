import React from 'react';
import IndexLeftBarVersions from './Components/IndexLeftBarVersions';
import IndexLeftBarMods from './Components/IndexLeftBarMods';
import IndexLeftBarChallenges from './Components/IndexLeftBarChallenges';
import ResetFiltersBtn from './Buttons/ResetFiltersBtn';
import IndexLeftBarTypes from './Components/IndexLeftBarTypes';

/**
 * Dispays the left bar items for the index page
 * @returns
 */
function IndexLeftBar() {
	return (
		<>
			<div className="hidden md:block mb-44">
				<IndexLeftBarTypes />
				<IndexLeftBarVersions />
				<IndexLeftBarMods />
				{/* <IndexLeftBarChallenges /> */}
				<ResetFiltersBtn />
			</div>
		</>
	);
}

export default IndexLeftBar;
