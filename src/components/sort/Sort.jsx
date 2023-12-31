import React from 'react';
import useFilters from '../../context/filters/FiltersActions';
import Select from '../selects/Select';
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
		localStorage.setItem('sort', e.target.id);
	};

	const { SelectBox, Option } = Select(handleChangeSort, { id: sortBy, text: optionToText(sortBy) });

	return (
		<SelectBox selectText="Sort:">
			<Option displayText="Views" id="views_most" />
			<Option displayText="Newest" id="date_newest" />
			<Option displayText="Oldest" id="date_oldest" />
			<Option displayText="Votes" id="upVotes" />
			<Option displayText="Comments" id="comments" />
		</SelectBox>
	);
}

/**
 * Returns the text value for a given option (aka enter "views_most" and get "Views")
 * @param {*} option
 * @returns
 */
const optionToText = option => {
	switch (option) {
		case 'views_most':
			return 'Views';
		case 'date_newest':
			return 'Newest';
		case 'date_oldest':
			return 'Oldest';
		case 'upVotes':
			return 'Votes';
		case 'comments':
			return 'Comments';
	}
};

export default Sort;
