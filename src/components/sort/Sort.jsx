import React, { useContext, useEffect } from 'react';
import FiltersContext from '../../context/filters/FiltersContext';
import useFilters from '../../context/filters/FiltersActions';

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
				<option selected={sortBy === 'views_most' ? true : false} value="views_most">
					Views
				</option>
				<option selected={sortBy === 'date_newest' ? true : false} value="date_newest">
					Date (newest)
				</option>
				<option selected={sortBy === 'date_oldest' ? true : false} value="date_oldest">
					Date (oldest)
				</option>
				<option selected={sortBy === 'upVotes' ? true : false} value="upVotes">
					Votes
				</option>
				<option selected={sortBy === 'comments' ? true : false} value="comments">
					Comments
				</option>
			</optgroup>
		</select>
	);
}

export default Sort;
