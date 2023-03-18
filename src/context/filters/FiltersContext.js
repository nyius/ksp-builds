import React, { createContext, useReducer, useEffect, useState } from 'react';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase.config';
import FiltersReducer from './FiltersReducer';

const FiltersContext = createContext();

export const FiltersProvider = ({ children }) => {
	const [filtersLoading, setFiltersLoading] = useState(true);

	useEffect(() => {
		// Fetch the KSP versions from the DB
		const fetchKspVersions = async () => {
			try {
				const data = await getDoc(doc(db, 'kspInfo', 'info'));
				const kspVersions = data.data();

				dispatchBuildFilters({
					type: 'SET_KSP_VERSIONS',
					payload: kspVersions.versions,
				});
				setFiltersLoading(false);
			} catch (error) {
				console.log(error);
				setFiltersLoading(false);
			}
		};
		fetchKspVersions();
	}, []);

	const initialState = {
		typeFilter: '',
		versionFilter: 'any',
		modsFilter: 'any',
		searchTerm: '',
		tagsSearch: '',
		sortBy: 'views',
		kspVersions: [],
	};

	const [state, dispatchBuildFilters] = useReducer(FiltersReducer, initialState);
	return <FiltersContext.Provider value={{ ...state, dispatchBuildFilters, filtersLoading }}>{children}</FiltersContext.Provider>;
};

export default FiltersContext;
