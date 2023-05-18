import React, { useEffect, useState } from 'react';
import algoliasearch from 'algoliasearch/lite';
import useBuilds from '../../context/builds/BuildsActions';
import { RiSearchEyeFill } from 'react-icons/ri';

function SearchBar() {
	const searchClient = algoliasearch('ASOR7A703R', process.env.REACT_APP_ALGOLIA_KEY);
	const index = searchClient.initIndex('builds');
	const [searchTerm, setSearchTerm] = useState('');

	const { fetchBuilds, fetchBuildsById } = useBuilds();

	/**
	 * Handles searching algolia for our craft
	 * @param {*} e
	 */
	const handleSearch = async e => {
		try {
			if (e.key === 'Enter' || e.type === 'click') {
				if (searchTerm === '') {
					fetchBuilds();
					return;
				}
				index.search(searchTerm).then(({ hits }) => {
					let ids = [];

					hits.map(hit => {
						ids.push(hit.objectID);
					});

					fetchBuildsById(ids);
				});
			}
		} catch (error) {
			console.log(error);
		}
	};

	//---------------------------------------------------------------------------------------------------//
	return (
		<div className="flex flex-row gap-1 items-center">
			<input onChange={e => setSearchTerm(e.target.value)} onKeyUp={e => handleSearch(e)} type="text" placeholder="Search" className="input input-bordered bg-base-900 hidden sm:block 2k:input-lg 2k:text-2xl" />
			<div className="btn btn-circle text-xl 2k:text-3xl text-slate-300 bg-base-900" onClick={e => handleSearch(e)}>
				<RiSearchEyeFill />
			</div>
		</div>
	);
}

export default SearchBar;
