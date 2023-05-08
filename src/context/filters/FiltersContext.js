import React, { createContext, useReducer, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getDoc, doc, getDocFromCache } from 'firebase/firestore';
import { db } from '../../firebase.config';
import FiltersReducer from './FiltersReducer';
import useCheckUrlForType from '../../utilities/useCheckUrlForType';

const FiltersContext = createContext();

export const FiltersProvider = ({ children }) => {
	const [filtersLoading, setFiltersLoading] = useState(true);
	const location = useLocation();
	const { checkUrlForType } = useCheckUrlForType();

	useEffect(() => {
		// Fetch the KSP versions from the DB

		const fetchKspInfo = async () => {
			try {
				const data = await getDoc(doc(db, 'kspInfo', 'info'));
				const kspInfo = data.data();

				dispatchBuildFilters({
					type: 'SET_KSP_VERSIONS',
					payload: kspInfo.versions,
				});
				dispatchBuildFilters({
					type: 'SET_KSP_CHALLENGES',
					payload: kspInfo.challenges,
				});
				setFiltersLoading(false);
			} catch (error) {
				console.log(error);
				setFiltersLoading(false);
			}
		};

		fetchKspInfo();

		// Sorting---------------------------------------------------------------------------------------------------//
		const sorting = localStorage.getItem('sort');

		if (sorting) {
			dispatchBuildFilters({
				type: 'SET_FILTERS',
				payload: {
					filter: 'sortBy',
					value: sorting,
				},
			});
		}

		//Type---------------------------------------------------------------------------------------------------//
		let type = checkUrlForType();

		if (type) {
			dispatchBuildFilters({
				type: 'SET_FILTERS',
				payload: {
					filter: 'typeFilter',
					value: type,
				},
			});
		}
	}, []);

	const initialState = {
		typeFilter: '',
		versionFilter: 'any',
		modsFilter: 'any',
		challengeFilter: 'any',
		searchTerm: '',
		tagsSearch: '',
		sortBy: 'views_most',
		kspVersions: [],
		kspChallenges: [],
	};

	const [state, dispatchBuildFilters] = useReducer(FiltersReducer, initialState);
	return <FiltersContext.Provider value={{ ...state, dispatchBuildFilters, filtersLoading }}>{children}</FiltersContext.Provider>;
};

export default FiltersContext;
