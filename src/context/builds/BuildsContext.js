import React, { createContext, useEffect, useReducer } from 'react';
import BuildsReducer from './BuildsReducer';
import { getDoc, doc, getDocFromCache, getDocs, query, where, orderBy, limit, collection } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { compact } from 'lodash';

const BuildsContext = createContext();

export const BuildsProvider = ({ children }) => {
	const windowWidth = window.innerWidth;

	// Initial state
	const initialState = {
		loadingBuilds: true,
		fetchingMoreBuilds: false,
		lastFetchedBuild: null,
		fetchedBuilds: [],
		allFetchedBuilds: {},
		usersOwnBuilds: [],
		favoriteBuilds: [],
		currentPage: 0,
		storedBuilds: [],
		fetchAmount: 15,
		buildOfTheWeek: null,
		loadingBuildOfTheWeek: true,
		gridSize: 1,
	};

	useEffect(() => {
		// Get window width and set gridSize for fetch amount
		if (windowWidth > 3500) {
			dispatchBuilds({
				type: 'SET_FETCHED_BUILDS',
				payload: { gridSize: 7, fetchAmount: 28 },
			});
		} else if (windowWidth > 2561) {
			dispatchBuilds({
				type: 'SET_FETCHED_BUILDS',
				payload: { gridSize: 6, fetchAmount: 24 },
			});
		} else if (windowWidth > 1920) {
			dispatchBuilds({
				type: 'SET_FETCHED_BUILDS',
				payload: { gridSize: 5, fetchAmount: 20 },
			});
		} else if (windowWidth > 1024) {
			dispatchBuilds({
				type: 'SET_FETCHED_BUILDS',
				payload: { gridSize: 4, fetchAmount: 16 },
			});
		} else if (windowWidth > 640) {
			dispatchBuilds({
				type: 'SET_FETCHED_BUILDS',
				payload: { gridSize: 2, fetchAmount: 8 },
			});
		} else {
			dispatchBuilds({
				type: 'SET_FETCHED_BUILDS',
				payload: { gridSize: 1, fetchAmount: 4 },
			});
		}

		const fetchServerWeeklyFeatured = async () => {
			try {
				const snap = await getDoc(doc(db, 'kspInfo', 'weeklyFeaturedBuild'));
				const data = snap.data();

				await fetchServerBuild(data.id);
			} catch (error) {
				console.log(`Couldn't find BotW`);
				dispatchBuilds({
					type: 'SET_LOADING_BUILD_OF_THE_WEEK',
					payload: false,
				});
			}
		};

		const fetchCacheBuild = async id => {
			try {
				const buildSnap = await getDocFromCache(doc(db, 'builds', id));
				const buildSnapData = buildSnap.data();

				dispatchBuilds({
					type: 'SET_BUILD_OF_THE_WEEK',
					payload: buildSnapData,
				});
			} catch (error) {
				fetchServerBuild(id);
			}
		};

		const fetchServerBuild = async id => {
			try {
				const buildSnap = await getDoc(doc(db, 'builds', id));
				const buildSnapData = buildSnap.data();

				dispatchBuilds({
					type: 'SET_BUILD_OF_THE_WEEK',
					payload: buildSnapData,
				});
			} catch (error) {
				console.log(error);
				dispatchBuilds({
					type: 'SET_LOADING_BUILD_OF_THE_WEEK',
					payload: false,
				});
			}
		};

		fetchServerWeeklyFeatured();
	}, []);

	const [state, dispatchBuilds] = useReducer(BuildsReducer, initialState);

	return <BuildsContext.Provider value={{ ...state, dispatchBuilds }}>{children}</BuildsContext.Provider>;
};

export default BuildsContext;
