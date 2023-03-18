import React, { useContext } from 'react';
import FiltersContext from '../../context/filters/FiltersContext';
import useFilters from '../../context/filters/FiltersActions';

function Sort() {
	const { setSortFilter } = useFilters();

	return (
		<select onChange={e => setSortFilter(e)} className="select select-bordered 2k:select-lg 2k:text-3xl 2k:font-thin max-w-xs bg-base-900 mr-6 md:mr-0">
			<optgroup>
				<option value="views_most">Views</option>
				<option value="date_newest">Date (newest)</option>
				<option value="date_oldest">Date (oldest)</option>
				<option value="upVotes">Votes</option>
				<option value="comments">Comments</option>
			</optgroup>
		</select>
	);
}

export default Sort;
