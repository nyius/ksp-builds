import React, { useContext } from 'react';
import FiltersContext from '../../context/filters/FiltersContext';
import useFilters from '../../context/filters/FiltersActions';
import SortOption from './Components/SortOption';

/**
 * Displays the build sorting dropdown
 * @returns
 */
function Sort() {
	const { sortBy } = useContext(FiltersContext);
	const { setSortFilter } = useFilters();

	/**
	 * Handles user changing sorting
	 * @param {*} e
	 */
	const handleChangeSort = e => {
		setSortFilter(e);
		localStorage.setItem('sort', e.target.value);
	};

	return (
		<select onChange={handleChangeSort} className="select select-bordered 2k:select-lg 2k:text-2xl 2k:font-thin max-w-xs bg-base-900 mr-6 md:mr-0">
			<optgroup>
				<SortOption text="Views" value="views_most" />
				<SortOption text="Date (newest)" value="date_newest" />
				<SortOption text="Date (oldest)" value="date_oldest" />
				<SortOption text="Votes" value="upVotes" />
				<SortOption text="Comments" value="comments" />
			</optgroup>
		</select>
	);
}

export default Sort;
