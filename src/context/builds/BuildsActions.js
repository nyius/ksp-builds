import { useEffect, useState } from 'react';
import { getDocs, collection, startAfter, orderBy, limit, query, where, getDocsFromCache } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { useBuildsContext } from './BuildsContext';
import { useAuthContext } from '../auth/AuthContext';
import { useFiltersContext } from '../filters/FiltersContext';
import useFilters from '../filters/FiltersActions';
import { cloneDeep, sortBy } from 'lodash';
import { checkLocalBuildAge, getBuildFromLocalStorage, setLocalStoredBuild } from '../build/BuildUtils';
import { useHangarContext } from '../hangars/HangarContext';
import { useParams, useSearchParams } from 'react-router-dom';
import algoliasearch from 'algoliasearch/lite';
import errorReport from '../../utilities/errorReport';

const searchClient = algoliasearch('ASOR7A703R', process.env.REACT_APP_ALGOLIA_KEY);
const searchIndex = searchClient.initIndex('builds');

/**
 * Hook with functions for fetching builds
 * @returns {fetchBuilds, fetchBuildsById, fetchMoreBuilds}
 */
const useBuilds = () => {
	const { dispatchBuilds, currentPage, storedBuilds, fetchAmount } = useBuildsContext();
	const { createFirestoreQuery } = useCreateFirestoreQuery();
	const { filterBuilds } = useFilters();

	/**
	 * Fetches builds from the DB. grabs all builds based on filters
	 */
	const fetchBuilds = async () => {
		try {
			setFetchedBuilds(dispatchBuilds, []);
			setBuildsLoading(dispatchBuilds, true);

			// await fetchLastUpdatedBuilds();
			let q = createFirestoreQuery('public');
			const buildsSnap = await getDocs(q);

			const builds = [];
			buildsSnap.forEach(doc => {
				builds.push(doc.data());
				setLocalStoredBuild(doc.data());
			});

			setFetchedBuilds(dispatchBuilds, builds);
			setLastfetchedBuild(dispatchBuilds, buildsSnap.docs.length < fetchAmount ? 'end' : buildsSnap.docs[buildsSnap.docs.length - 1]);
			setStoredBuilds(dispatchBuilds, [builds]);
		} catch (error) {
			errorReport(error.message, true, 'fetchBuilds');
			setBuildsLoading(dispatchBuilds, false);
		}
	};

	/**
	 * Handles fetching an array of builds
	 * @param {arr} buildsToFetch - an array of build ids to fetch
	 * @param {string} fetchUid - a users UID (optional)
	 * @param {string} type - public/private/unlisted
	 */
	const fetchBuildsById = async (buildsToFetch, fetchUid, type) => {
		try {
			setFetchedBuilds(dispatchBuilds, []);
			setBuildsLoading(dispatchBuilds, true);

			const localBuildsToKeep = [];
			const localBuildsToKeepIds = [];
			const localBuildsToKeepIndex = [];
			const localBuildsToFetch = [];

			// First see if we have any from localStorage
			buildsToFetch.map((buildId, i) => {
				const localBuild = getBuildFromLocalStorage(buildId);
				if (localBuild) {
					if (checkLocalBuildAge(localBuild.lastFetchedTimestamp, 10)) {
						localBuildsToFetch.push(localBuild.id);
					} else {
						localBuildsToKeep.push(localBuild);
						localBuildsToKeepIds.push(localBuild.id);
						localBuildsToKeepIndex.push(i);
					}
				}
			});

			// filter the builds we are keeping from local storage from those to fetch
			const filteredBuildsToFetch = buildsToFetch.filter(id => !localBuildsToKeepIds.includes(id));

			const batches = [];

			// because firestore only allows query 'in' by groups of 10, we have to break it up into chunks of 10
			// by using splice, we alter the original input 'buildsToFetchCopy' arr by removing 10 at a time
			while (filteredBuildsToFetch.length) {
				const batch = filteredBuildsToFetch.splice(0, 10);
				let q = createFirestoreQuery(type, null, fetchUid ? fetchUid : null, batch);
				// this gets all of the docs from our query, then loops over them and returns the raw data to our array
				batches.push(getDocs(q).then(res => res.docs.map(res => res.data())));
			}

			const serverFetchedBuilds = await Promise.all(batches);
			const builds = serverFetchedBuilds.flat();

			builds.map(build => {
				setLocalStoredBuild(build);
			});

			// Now recombine the fetched builds vs local builds
			localBuildsToKeep.map((build, i) => {
				builds.splice(localBuildsToKeepIndex[i], 0, build);
			});

			const sortedBuilds = filterBuilds(builds);

			const buildsToStore = [];

			// because firestore only allows query 'in' by groups of 10, we have to break it up into chunks of 10
			// by using splice, we alter the original input 'buildsToFetchCopy' arr by removing 10 at a time
			while (sortedBuilds.length) {
				const batch = sortedBuilds.splice(0, fetchAmount);
				// this gets all of the docs from our query, then loops over them and returns the raw data to our array
				buildsToStore.push(batch);
			}

			setFetchedBuilds(dispatchBuilds, buildsToStore[0] ? buildsToStore[0] : []);
			setStoredBuilds(dispatchBuilds, buildsToStore);
		} catch (error) {
			errorReport(error.message, true, 'fetchBuildsById');
			setBuildsLoading(dispatchBuilds, false);
			throw new Error(error);
		}
	};

	/**
	 * Handles fetching more builds (like if the user goes to the next page)
	 */
	const fetchMoreBuilds = async () => {
		try {
			const currentPageNum = currentPage + 1;
			// First check what page we're on, and how many pages we have saved in pagination. That way we can load the paginated builds instead of fetching from the db
			if (currentPageNum < storedBuilds.length) {
				setFetchedBuilds(dispatchBuilds, [...storedBuilds[currentPageNum]]);
				setCurrentPage(dispatchBuilds, currentPageNum);
				return;
			}

			dispatchBuilds({ type: 'FETCHING_MORE_BUILDS', payload: true });

			let q = createFirestoreQuery('public', true);
			const buildsSnap = await getDocs(q);

			const builds = [];
			buildsSnap.forEach(doc => {
				builds.push(doc.data());
				setLocalStoredBuild(doc.data());
			});

			setFetchedBuilds(dispatchBuilds, builds);
			setLastfetchedBuild(dispatchBuilds, buildsSnap.docs.length < fetchAmount ? 'end' : buildsSnap.docs[buildsSnap.docs.length - 1]);
			setStoredBuilds(dispatchBuilds, [...storedBuilds, builds]);
			setCurrentPage(dispatchBuilds, currentPageNum);
		} catch (error) {
			errorReport(error.message, true, 'fetchMoreBuilds');
			setBuildsLoading(dispatchBuilds, false);
			throw new Error(error);
		}
	};

	return { fetchBuilds, fetchBuildsById, fetchMoreBuilds };
};

export default useBuilds;

/**
 * Handles fetching a batch of builds by their ids
 * @param {arr} buildIds - an array of builds ids to fetch
 * @param {string} fetchUid - a users UID (optional)
 * @param {string} type - public/private/unlisted
 */
export const useFetchBuildsById = (buildIds, fetchUid, type) => {
	const { sortBy } = useFiltersContext();
	const { dispatchBuilds } = useBuildsContext();
	const { fetchBuildsById } = useBuilds();
	const { fetchAmount } = useBuildsContext();
	const { openedHangar } = useHangarContext();

	useEffect(() => {
		if (!buildIds) return;

		if (buildIds.length > 0) {
			if (!openedHangar) {
				fetchBuildsById(buildIds, fetchUid, type);
			}
		} else {
			setBuildsLoading(dispatchBuilds, false);
		}
	}, [sortBy, fetchAmount]);
};

/**
 * Fetches builds from the server.
 * Listens to changes in filters and search params.
 */
export const useFetchBuilds = () => {
	const { typeFilter, versionFilter, sortBy, modsFilter, challengeFilter } = useFiltersContext();
	const { fetchBuildsById, fetchBuilds } = useBuilds();
	const [searchParams] = useSearchParams();
	const urlParams = useParams();
	const { fetchAmount } = useBuildsContext();

	// listens for changes to filters/searches and fetches builds based on filter
	useEffect(() => {
		const searchQuery = searchParams.get('search_query');

		if (searchQuery) {
			searchIndex.search(searchQuery).then(({ hits }) => {
				let ids = [];

				hits.map(hit => {
					ids.push(hit.objectID);
				});

				fetchBuildsById(ids, null, 'public');
			});
		} else if (urlParams.id) {
			fetchBuilds();
		} else {
			fetchBuilds();
		}
	}, [urlParams, searchParams, modsFilter, versionFilter, challengeFilter, sortBy, fetchAmount, typeFilter]);
};

/**
 * Hook with functions for handling the current builds page
 */
export const useChangePage = () => {
	const { dispatchBuilds, storedBuilds, currentPage } = useBuildsContext();
	/**
	 * Handles going back a page. Gets the page from the localstorage
	 * @param {num} page
	 */
	const goBackPage = page => {
		setBuildsLoading(dispatchBuilds, true);

		setFetchedBuilds(dispatchBuilds, [...storedBuilds[page]]);
		setCurrentPage(dispatchBuilds, currentPage - 1);
		setBuildsLoading(dispatchBuilds, false);
	};

	/**
	 * Handles going back to page 0
	 */
	const goToStartPage = () => {
		if (storedBuilds[0]) {
			setFetchedBuilds(dispatchBuilds, storedBuilds[0]);
			setCurrentPage(dispatchBuilds, 0);
		}
	};

	return { goBackPage, goToStartPage };
};

/**
 * Hook for functions that return a firestore query
 */
export const useCreateFirestoreQuery = () => {
	const { typeFilter, versionFilter, modsFilter, challengeFilter, sortBy } = useFiltersContext();
	const { lastFetchedBuild, fetchAmount } = useBuildsContext();
	const { user } = useAuthContext();

	/**
	 * handles creating a firestore query.
	 * @param {string} type - 'public' if only want builds that are public (not unlisted/private)
	 * @param {docRef} startAfterLastFetched - a reference to the document to start querying after (if pagination)
	 * @param {string} fetchUid - an ID for the users whose builds we're fetching
	 * @param {arr} buildsBatch - can take in a batch of 10 build ids
	 * @returns
	 */
	const createFirestoreQuery = (type, startAfterLastFetched, fetchUid, buildIds) => {
		const constraints = [limit(fetchAmount)];

		// Sorting Filters
		if (versionFilter !== 'any') constraints.unshift(where('kspVersion', '==', versionFilter));
		if (typeFilter !== '') constraints.unshift(where('types', 'array-contains', typeFilter));
		if (modsFilter == 'yes') constraints.unshift(where('modsUsed', '==', true));
		if (modsFilter == 'no') constraints.unshift(where('modsUsed', '==', false));
		if (challengeFilter !== 'any') constraints.unshift(where('forChallenge', '==', challengeFilter));
		if (sortBy == 'views_most') constraints.unshift(orderBy('views', 'desc'));
		if (sortBy == 'date_newest') constraints.unshift(orderBy('timestamp', 'desc'));
		if (sortBy == 'date_oldest') constraints.unshift(orderBy('timestamp', 'asc'));
		if (sortBy == 'upVotes') constraints.unshift(orderBy('upVotes', 'desc'));
		if (sortBy == 'comments') constraints.unshift(orderBy('commentCount', 'desc'));

		// Batch of Ids
		if (buildIds) constraints.push(where('id', 'in', buildIds));

		// Fetch More Filter
		if (startAfterLastFetched) constraints.push(startAfter(lastFetchedBuild));

		// Public builds Filter
		if (type === 'public') constraints.unshift(where('visibility', '==', 'public'));
		if (type === 'user' && fetchUid !== user?.uid) constraints.unshift(where('visibility', '==', 'public'));

		return query(collection(db, process.env.REACT_APP_BUILDSDB), ...constraints);
	};

	return { createFirestoreQuery };
};

/**
 * Fetches builds for the current open hangar
 */
export const useFetchOpenHangarBuilds = () => {
	const { openedHangar } = useHangarContext();
	const { fetchBuildsById } = useBuilds();
	const { sortBy } = useFiltersContext();
	const { fetchAmount } = useBuildsContext();

	useEffect(() => {
		if (openedHangar) {
			fetchBuildsById(openedHangar.builds, null, 'public');
		}
	}, [openedHangar, sortBy, fetchAmount]);
};

/**
 * Handles setting the current builds page on page load
 * @param {int} pageNum - page to go to
 */
export const useSetCurrentPage = pageNum => {
	const { dispatchBuilds } = useBuildsContext();

	useEffect(() => {
		setCurrentPage(dispatchBuilds, pageNum);
	}, []);
};

/**
 * Handles storing the fetched builds in a state that we can use (as to not use directly from context).
 * Listens to LoadingBuilds, fetchedBuilds, and buildsToDisplay for changes.
 * @param {*} initialState - an initial state
 * @param {arr} buildsToDisplay - (optional) An array of builds to set
 * @returns [builds, setBuilds]
 */
export const useLoadedBuilds = (initialState, buildsToDisplay) => {
	const [builds, setBuilds] = useState(initialState);
	const { loadingBuilds, fetchedBuilds } = useBuildsContext();

	useEffect(() => {
		if (!loadingBuilds) {
			setBuilds(buildsToDisplay ? buildsToDisplay : fetchedBuilds);
		}
	}, [loadingBuilds, fetchedBuilds, buildsToDisplay]);

	return [builds, setBuilds];
};

/**
 * Returns the current fetched builds, sorted
 * @param {*} initialState
 * @returns [filteredBuilds, setFilteredBuilds]
 */
export const useGetFilteredBuilds = initialState => {
	const { filterBuilds } = useFilters();
	const { sortBy } = useFiltersContext();
	const { fetchedBuilds } = useBuildsContext();
	const [filteredBuilds, setFilteredBuilds] = useState(initialState);

	// Listen for changes to the sorting and filter the builds accordingly
	useEffect(() => {
		let newFetchedBuilds = cloneDeep(fetchedBuilds);

		setFilteredBuilds(filterBuilds(newFetchedBuilds));
	}, [fetchedBuilds, sortBy]);

	return [filteredBuilds, setFilteredBuilds];
};

/**
 * Handles setting a forced view mode for the builds list
 * @param {*} view
 */
export const useSetBuildsForcedView = view => {
	const { dispatchBuilds } = useBuildsContext();

	useEffect(() => {
		setBuildsForcedView(dispatchBuilds, view);
	}, [dispatchBuilds, view]);
};

// State Updaters -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
/**
 * handles setting fetched builds in the context
 * @param {function} dispatchBuilds - Dispatch function
 * @param {arr} builds - takes an array of builds
 */
export const setFetchedBuilds = (dispatchBuilds, builds) => {
	dispatchBuilds({
		type: 'SET_FETCHED_BUILDS',
		payload: {
			fetchedBuilds: builds,
			loadingBuilds: false,
		},
	});
};

/**
 * Handles setting the loading state for fetching builds
 * @param {function} dispatchBuilds - Dispatch function
 * @param {bool} - true or false
 */
export const setBuildsLoading = (dispatchBuilds, bool) => {
	dispatchBuilds({
		type: 'SET_FETCHED_BUILDS',
		payload: { loadingBuilds: bool },
	});
};

/**
 * Handles setting the stored builds for pagination use (so we dont re-fetch builds)
 * @param {function} dispatchBuilds - Dispatch function
 * @param {arr} buildsToStore - an array of builds to store in local storage
 */
export const setStoredBuilds = (dispatchBuilds, buildsToStore) => {
	dispatchBuilds({
		type: 'SET_FETCHED_BUILDS',
		payload: {
			storedBuilds: buildsToStore,
		},
	});
};

/**
 * Handles setting what page of builds the user is currently viewing
 * @param {function} dispatchBuilds - Dispatch function
 * @param {num} page - what page we are on
 */
export const setCurrentPage = (dispatchBuilds, page) => {
	dispatchBuilds({
		type: 'SET_CURRENT_PAGE',
		payload: page,
	});
};

/**
 * Handles setting how many builds to fetch
 * @param {function} dispatchBuilds - Dispatch function
 * @param {num} amount - amount of builds to fetch
 */
export const setFetchAmount = (dispatchBuilds, amount) => {
	dispatchBuilds({
		type: 'SET_FETCH_AMOUNT',
		payload: amount,
	});
};

/**
 * Clears the fetched builds
 * @param {function} dispatchBuilds - Dispatch function
 */
export const clearFetchedBuilds = dispatchBuilds => {
	dispatchBuilds({
		type: 'CLEAR_BUILDS',
		payload: null,
	});
};

/**
 * handles setting the last fetched build in the context (for pagination use)
 * @param {function} dispatchBuilds - Dispatch function
 * @param {docRef} lastFetchedBuild - takes in either a docRef to the last fetched build or 'end' if theres no more builds to fetch
 */
export const setLastfetchedBuild = (dispatchBuilds, lastFetchedBuild) => {
	dispatchBuilds({
		type: 'SET_FETCHED_BUILDS',
		payload: {
			lastFetchedBuild: lastFetchedBuild,
		},
	});
};

/**
 * handles setting the view type for builds (list/grid)
 * @param {function} dispatchBuilds - Dispatch function
 * @param {string} view - takes in thew view to display (grid/list)
 */
export const setBuildsView = (dispatchBuilds, view) => {
	dispatchBuilds({
		type: 'setBuildsView',
		payload: view,
	});
};

/**
 * handles setting a forced view for builds list (pinnedList)
 * @param {function} dispatchBuilds - Dispatch function
 * @param {string} view - takes in thew view to display (pinnedList)
 */
export const setBuildsForcedView = (dispatchBuilds, view) => {
	dispatchBuilds({
		type: 'setBuildsForcedView',
		payload: view,
	});
};
