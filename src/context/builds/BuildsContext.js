import React, { createContext, useEffect, useReducer } from 'react';
import BuildsReducer from './BuildsReducer';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { compact } from 'lodash';

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
		fetchAmount: 15,
		buildOfTheWeek: null,
		loadingBuildOfTheWeek: true,
	};

	useEffect(() => {
		/*	
		// Fetch all of the weekly featured builds
		const fetchWeeklyFeaturedBuilds = async () => {
			try {
				// Get the featured builds
				const weeklyFeaturedBuildsSnap = await getDoc(doc(db, 'kspInfo', 'weeklyFeaturedBuilds'));
				const weeklyFeaturedBuildsData = weeklyFeaturedBuildsSnap.data();

				let batches = [];
				let buildsArr = [];

				// Loop over them and fetch them from the db
				for (const build in weeklyFeaturedBuildsData) {
					buildsArr.push({ id: build, dateAdded: weeklyFeaturedBuildsData[build].dateAdded });
				}

				buildsArr.sort((a, b) => {
					return a.dateAdded.seconds < b.dateAdded.seconds ? 1 : -1;
				});

				const buildsToFetch = buildsArr.slice(0, 10);

				buildsToFetch.map(build => {
					if (process.env.REACT_APP_ENV === 'DEV') {
						batches.push(getDoc(doc(db, 'testBuilds', build.id)).then(res => res.data()));
					} else {
						batches.push(getDoc(doc(db, 'builds', build.id)).then(res => res.data()));
					}
					build.dateAdded = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(build.dateAdded.seconds * 1000);
				});

				const fetchedFeaturedBuilds = await Promise.all(batches);

				let newArr = compact(fetchedFeaturedBuilds);

				dispatchBuilds({
					type: 'SET_FEATURED_BUILDS',
					payload: newArr,
				});
			} catch (error) {
				console.log(error);
			}
		};
		fetchWeeklyFeaturedBuilds();
		*/

		// Fetch currently build of the week
		const fetchWeeklyFeaturedBuilds = async () => {
			try {
				// Get the featured builds
				const weeklyFeaturedBuildSnap = await getDoc(doc(db, 'kspInfo', 'weeklyFeaturedBuild'));
				const weeklyFeaturedBuildData = weeklyFeaturedBuildSnap.data();
				let weeklyFeaturedBuild;

				if (process.env.REACT_APP_ENV === 'DEV') {
					await getDoc(doc(db, 'testBuilds', weeklyFeaturedBuildData.id)).then(res => (weeklyFeaturedBuild = res.data()));
				} else {
					await getDoc(doc(db, 'builds', weeklyFeaturedBuildData.id)).then(res => (weeklyFeaturedBuild = res.data()));
				}

				dispatchBuilds({
					type: 'SET_BUILD_OF_THE_WEEK',
					payload: weeklyFeaturedBuild,
				});
			} catch (error) {
				console.log(error);
				dispatchBuilds({
					type: 'SET_LOADING_BUILD_OF_THE_WEEK',
					payload: false,
				});
			}
		};
		fetchWeeklyFeaturedBuilds();
	}, []);

	const [state, dispatchBuilds] = useReducer(BuildsReducer, initialState);

	return <BuildsContext.Provider value={{ ...state, dispatchBuilds }}>{children}</BuildsContext.Provider>;
};

export default BuildsContext;
