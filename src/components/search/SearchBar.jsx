import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useBuilds from '../../context/builds/BuildsActions';
import errorReport from '../../utilities/errorReport';
import SearchIcon from '../../assets/search.svg';

/**
 * Displays the search bar
 * @returns
 */
function SearchBar() {
	const [searchTerm, setSearchTerm] = useState('');
	const navigate = useNavigate();
	const { fetchBuilds } = useBuilds();

	/**
	 * Handles searching algolia for our craft
	 * @param {*} e
	 */
	const handleSearch = async e => {
		try {
			if (e.key === 'Enter' || e.type === 'click') {
				if (searchTerm === '') {
					navigate(`/`);
					fetchBuilds();
					return;
				} else {
					navigate(`/results?search_query=${searchTerm}`);
				}
			}
		} catch (error) {
			errorReport(error.message, true, 'handleSearch');
		}
	};
	//---------------------------------------------------------------------------------------------------//
	return (
		<div className="flex flex-row gap-1 items-center w-[30rem] 2k:w-[60rem] relative">
			<input id="build-search" onChange={e => setSearchTerm(e.target.value)} onKeyUp={handleSearch} type="text" placeholder="Search" className="input bg-base-200 border-solid border-1 border-slate-700 input-lg w-full !text-2xl" />
			<div className="btn btn-circle text-2xl h-12 w-12 text-slate-400 bg-base-600 hover:text-slate-100 absolute right-2" onClick={handleSearch}>
				<img src={SearchIcon} alt="" className="h-7" />
			</div>
		</div>
	);
}

export default SearchBar;
