import React, { useContext } from 'react';
import FiltersContext from '../../context/filters/FiltersContext';
import useFilters from '../../context/filters/FiltersActions';

function Sort() {
	const { setSortFilter } = useFilters();

	return (
		<select onChange={e => setSortFilter(e)} className="select select-bordered max-w-xs bg-base-900">
			<optgroup>
				<option value="date_newest">Date (newest)</option>
				<option value="date_oldest">Date (oldest)</option>
				<option value="upVotes">Votes</option>
				<option value="comments">Comments</option>
				<option value="views_most">Views (most)</option>
				<option value="views_least">Views (least)</option>
			</optgroup>
		</select>
	);
}

export default Sort;
