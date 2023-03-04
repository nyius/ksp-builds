import React from 'react';
import useFilters from '../../context/filters/FiltersActions';

function SearchBar() {
	const { setSearchFilter } = useFilters();
	return <input onChange={e => setSearchFilter(e)} type="text" placeholder="Search" className="input input-bordered mr-4 bg-base-900" />;
}

export default SearchBar;
