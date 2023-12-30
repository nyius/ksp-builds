import React, { useState } from 'react';
import useFilters from '../../context/filters/FiltersActions';
import { useFiltersContext } from '../../context/filters/FiltersContext';
import Select, { Option } from '../selects/Select';

/**
 * Displays the build sorting dropdown
 * @returns
 */
function Sort() {
	const { setSortFilter } = useFilters();
	const { sortBy } = useFiltersContext();

	const [visible, setVisible] = useState(false);

	/**
	 * Handles user changing sorting
	 * @param {*} e
	 */
	const handleChangeSort = e => {
		setSortFilter(e);
		localStorage.setItem('sort', e.target.id);
		setVisible(false);
	};

	return (
		<Select selectedOption={optionToText(sortBy)} visibleState={visible} visibleSetter={setVisible} selectText="Sort:">
			<Option selectedOption={sortBy} displayText="Views" id="views_most" handlerFunc={handleChangeSort} />
			<Option selectedOption={sortBy} displayText="Newest" id="date_newest" handlerFunc={handleChangeSort} />
			<Option selectedOption={sortBy} displayText="Oldest" id="date_oldest" handlerFunc={handleChangeSort} />
			<Option selectedOption={sortBy} displayText="Votes" id="upVotes" handlerFunc={handleChangeSort} />
			<Option selectedOption={sortBy} displayText="Comments" id="comments" handlerFunc={handleChangeSort} />
		</Select>
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
