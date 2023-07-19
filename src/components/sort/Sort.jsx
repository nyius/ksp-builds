import React from 'react';
import useFilters from '../../context/filters/FiltersActions';
import { useFiltersContext } from '../../context/filters/FiltersContext';

/**
 * Displays the build sorting dropdown
 * @returns
 */
function Sort() {
	const { setSortFilter } = useFilters();
	const { sortBy } = useFiltersContext();

	/**
	 * Handles user changing sorting
	 * @param {*} e
	 */
	const handleChangeSort = e => {
		setSortFilter(e);
		localStorage.setItem('sort', e.target.value);
	};

	return (
		<select value={sortBy ? sortBy : 'views_most'} onChange={handleChangeSort} className="select select-bordered 2k:select-lg 2k:text-2xl 2k:font-thin max-w-xs bg-base-900">
			<option value="views_most">Views</option>
			<option value="date_newest">Date (newest)</option>
			<option value="date_oldest">Date (oldest)</option>
			<option value="upVotes">Votes</option>
			<option value="comments">Comments</option>
		</select>
	);
}

export default Sort;
