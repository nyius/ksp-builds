import React, { createContext, useContext, useEffect, useReducer } from 'react';
import BuildsReducer from './BuildsReducer';
import { getDoc, doc, getDocFromCache } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { useLocation, useParams } from 'react-router-dom';
import { setBuildsForcedView, setBuildsView } from './BuildsActions';
import { checkLocalBuildAge } from '../build/BuildUtils';
import errorReport from '../../utilities/errorReport';

const BuildsContext = createContext();

export const BuildsProvider = ({ children }) => {
	const windowWidth = window.innerWidth;
	const location = useLocation();

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
		buildsView: 'grid',
		forcedView: null,
	};

	// Fetch Amount
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
				payload: { gridSize: 1, fetchAmount: 8 },
			});
		}

		const fetchServerWeeklyFeatured = async () => {
			try {
				const snap = await getDoc(doc(db, 'kspInfo', 'weeklyFeaturedBuild'));
				const data = snap.data();

				await fetchServerBuild(data.id);
			} catch (error) {
				errorReport(`Couldn't find BotW: ${error.message}`, true, 'fetchServerWeeklyFeatured');

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
				errorReport(error.message, true, 'fetchServerBuild');
				dispatchBuilds({
					type: 'SET_LOADING_BUILD_OF_THE_WEEK',
					payload: false,
				});
			}
		};

		fetchServerWeeklyFeatured();
	}, []);

	// Set builds forced view type
	useEffect(() => {
		if (location.pathname.split('/')[1] !== 'build') {
			setBuildsForcedView(dispatchBuilds, null);
		}
	}, [location]);

	// set builds view
	useEffect(() => {
		const buildsViewLocal = JSON.parse(localStorage.getItem('buildsView'));

		if (buildsViewLocal) {
			setBuildsView(dispatchBuilds, buildsViewLocal);
		}
	}, []);

	// Loop over builds and remove any that are older than 30 days
	useEffect(() => {
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			const value = localStorage.getItem(key);

			if (!value) return;

			if (value.includes(`"type":"build"`)) {
				let build = JSON.parse(value);

				if (checkLocalBuildAge(build.lastFetchedTimestamp, 43200)) {
					localStorage.removeItem(key);
				}
			}
		}
	}, []);

	const [state, dispatchBuilds] = useReducer(BuildsReducer, initialState);

	return <BuildsContext.Provider value={{ ...state, dispatchBuilds }}>{children}</BuildsContext.Provider>;
};

/**
 * Builds Context
 * @returns
 */
export const useBuildsContext = () => {
	const context = useContext(BuildsContext);

	return context;
};

export default BuildsContext;
