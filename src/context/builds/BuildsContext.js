import React, { createContext, useReducer } from 'react';
import BuildsReducer from './BuildsReducer';

const BuildsContext = createContext();

export const BuildsProvider = ({ children }) => {
	// Initial state
	const initialState = {
		loadingBuilds: true,
		fetchingMoreBuilds: false,
		lastFetchedBuild: null,
		fetchedBuilds: [],
		usersOwnBuilds: [],
		favoriteBuilds: [],
		currentPage: 0,
		storedBuilds: [],
	};

	const [state, dispatchBuilds] = useReducer(BuildsReducer, initialState);

	return <BuildsContext.Provider value={{ ...state, dispatchBuilds }}>{children}</BuildsContext.Provider>;
};

export default BuildsContext;
