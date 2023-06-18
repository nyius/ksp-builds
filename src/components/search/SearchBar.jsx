import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useBuilds from '../../context/builds/BuildsActions';
import { RiSearchEyeFill } from 'react-icons/ri';

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
			console.log(error);
		}
	};

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className="flex flex-row gap-1 items-center">
			<input onChange={e => setSearchTerm(e.target.value)} onKeyUp={e => handleSearch(e)} type="text" placeholder="Search" className="input input-bordered bg-base-900 hidden sm:block 2k:input-lg 2k:text-2xl" />
			<div className="btn btn-circle text-xl 2k:text-2xl text-slate-300 bg-base-900" onClick={e => handleSearch(e)}>
				<RiSearchEyeFill />
			</div>
		</div>
	);
}

export default SearchBar;
