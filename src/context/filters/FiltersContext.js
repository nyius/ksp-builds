import React, { createContext, useReducer, useEffect, useState, useContext } from 'react';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase.config';
import FiltersReducer from './FiltersReducer';
import useCheckUrlForType from '../../hooks/useCheckUrlForType';
import errorReport from '../../utilities/errorReport';

const FiltersContext = createContext();

export const FiltersProvider = ({ children }) => {
	const [filtersLoading, setFiltersLoading] = useState(true);
	const { checkUrlForType } = useCheckUrlForType();

	// Fetch the KSP versions from the DB
	useEffect(() => {
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
				if (error.message !== 'Failed to get document because the client is offline.') {
					errorReport(error.message, true, 'fetchKspInfo');
				} else {
					errorReport(error.message, false, 'fetchKspInfo');
				}
				setFiltersLoading(false);
			}
		};

		fetchKspInfo();
	}, []);

	// Sorting---------------------------------------------------------------------------------------------------//
	useEffect(() => {
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
	}, []);

	//Type---------------------------------------------------------------------------------------------------//
	useEffect(() => {
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
		sortBy: 'views_most',
		kspVersions: [],
		kspChallenges: [],
	};

	const [state, dispatchBuildFilters] = useReducer(FiltersReducer, initialState);
	return <FiltersContext.Provider value={{ ...state, dispatchBuildFilters, filtersLoading }}>{children}</FiltersContext.Provider>;
};

/**
 * Filters Context
 * @returns
 */
export const useFiltersContext = () => {
	const context = useContext(FiltersContext);

	return context;
};

export default FiltersContext;
