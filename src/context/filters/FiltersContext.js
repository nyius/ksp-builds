import React, { createContext, useReducer } from 'react';
import FiltersReducer from './FiltersReducer';

const FiltersContext = createContext();

export const FiltersProvider = ({ children }) => {
	const initialState = {
		typeFilter: '',
		versionFilter: 'any',
		searchTerm: '',
		tagsSearch: '',
		sortBy: 'date_newest',
	};

	const [state, dispatchBuildFilters] = useReducer(FiltersReducer, initialState);
	return <FiltersContext.Provider value={{ ...state, dispatchBuildFilters }}>{children}</FiltersContext.Provider>;
};

export default FiltersContext;
