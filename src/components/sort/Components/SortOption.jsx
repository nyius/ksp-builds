import React, { useContext } from 'react';
import FiltersContext from '../../../context/filters/FiltersContext';

/**
 * Displays an option for the sorting dropdown
 * @param {*} text - the text to display
 * @param {*} value - the value for the option (like date_newest)
 * @returns
 */
function SortOption({ text, value }) {
	const { sortBy } = useContext(FiltersContext);

	return (
		<option selected={sortBy === value ? true : false} value={value}>
			{text}
		</option>
	);
}

export default SortOption;
