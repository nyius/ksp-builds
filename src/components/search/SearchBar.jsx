import React from 'react';
import useFilters from '../../context/filters/FiltersActions';

function SearchBar() {
	const { setSearchFilter } = useFilters();
	return <input onChange={e => setSearchFilter(e)} type="text" placeholder="Search" className="input input-bordered bg-base-900 hidden sm:block 2k:input-lg" />;
}

export default SearchBar;
