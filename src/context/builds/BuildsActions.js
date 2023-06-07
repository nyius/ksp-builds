import { useContext } from 'react';
import { getDocs, collection, startAfter, orderBy, limit, query, where, getDocsFromCache } from 'firebase/firestore';
import { db } from '../../firebase.config';
import BuildsContext from './BuildsContext';
import AuthContext from '../auth/AuthContext';
import FiltersContext from '../filters/FiltersContext';
import { cloneDeep } from 'lodash';
import { checkLocalBuildAge, getBuildFromLocalStorage, setLocalStoredBuild } from '../../utilities/buildLocalStorage';

/**
 * Hook with functions for fetching builds
 * @returns
 */
const useBuilds = () => {
	const { dispatchBuilds, currentPage, storedBuilds, fetchAmount } = useContext(BuildsContext);
	const { createFirestoreQuery } = useCreateFirestoreQuery();

	/**
	 * Fetches builds from the DB. Takes in an array of build ids to fetch. if no IDs specified, grabs all builds based on filters
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

			/*
			if (!buildsSnap.empty) {
				buildsSnap.forEach(doc => {
					builds.push(doc.data());
				});
			} else {
				const buildsSnap = await getDocs(q);

				buildsSnap.forEach(doc => {
					builds.push(doc.data());
				});
			}
			*/

			setFetchedBuilds(dispatchBuilds, builds);
			setLastfetchedBuild(dispatchBuilds, buildsSnap.docs.length < fetchAmount ? 'end' : buildsSnap.docs[buildsSnap.docs.length - 1]);
			setStoredBuilds(dispatchBuilds, [builds]);
		} catch (error) {
			console.log(error);
			setBuildsLoading(dispatchBuilds, false);
			throw new Error(error);
		}
	};

	/**
	 * Handles fetching an array of builds
	 * @param {arr} buildsToFetch - an array of build ids to fetch
	 * @param {string} fetchUid - a users UID
	 */
	const fetchBuildsById = async (buildsToFetch, fetchUid, type) => {
		const buildsToFetchCopy = cloneDeep(buildsToFetch);
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

			// filter the builds we are keeping from local storate from those to fetch
			const filteredBuildsToFetch = buildsToFetchCopy.filter(id => !localBuildsToKeepIds.includes(id));

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

			localBuildsToKeep.map((build, i) => {
				builds.splice(localBuildsToKeepIndex[i], 0, build);
			});

			// Now recombine the fetched builds vs local builds
			setFetchedBuilds(dispatchBuilds, builds);
		} catch (error) {
			console.log(error);
			setBuildsLoading(dispatchBuilds, false);
			throw new Error(error);
		}
	};

	/**
	 * Fetches the lasted added/updated builds
	 */
	const fetchLastUpdatedBuilds = async () => {
		try {
			const buildsRef = collection(db, process.env.REACT_APP_BUILDSDB);
			// Get the most recently updated doc
			let newestDocQ = query(buildsRef, where('visibility', '==', 'public'), orderBy('lastModified', 'desc'), limit(1));
			const newestDocSnap = await getDocs(newestDocQ);
			let newestDoc;

			newestDocSnap.forEach(doc => {
				newestDoc = doc.data();
			});

			// Fetch the locally saved newest
			const localNewest = JSON.parse(localStorage.getItem('newestBuild'));

			if (localNewest) {
				// check if the local newest update is now older than the last thing updated on the server
				if (localNewest.seconds < newestDoc.lastModified.seconds) {
					let newDocsQ = query(buildsRef, where('visibility', '==', 'public'), where('lastModified', '>', new Date(localNewest.seconds * 1000)));
					await getDocs(newDocsQ);

					localStorage.setItem('newestBuild', JSON.stringify(newestDoc.lastModified));
				}
			} else {
				// Users first time/ no localNewest saved, fetch all builds so they're cached
				console.log(`No local stored timestamp`);
				const buildsRef = collection(db, process.env.REACT_APP_BUILDSDB);
				await getDocs(buildsRef);
				localStorage.setItem('newestBuild', JSON.stringify(newestDoc.lastModified));
			}
		} catch (error) {
			console.log(error);
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

			/*
			if (!buildsSnap.empty) {
				buildsSnap.forEach(doc => {
					builds.push(doc.data());
				});
			} else {
				const buildsSnap = await getDocs(q);

				buildsSnap.forEach(doc => {
					builds.push(doc.data());
				});
			}
			*/

			setFetchedBuilds(dispatchBuilds, builds);
			setLastfetchedBuild(dispatchBuilds, buildsSnap.docs.length < fetchAmount ? 'end' : buildsSnap.docs[buildsSnap.docs.length - 1]);
			setStoredBuilds(dispatchBuilds, [...storedBuilds, builds]);
			setCurrentPage(dispatchBuilds, currentPageNum);
		} catch (error) {
			console.log(error);
			setBuildsLoading(dispatchBuilds, false);
			throw new Error(error);
		}
	};

	return { fetchBuilds, fetchBuildsById, fetchMoreBuilds };
};

export default useBuilds;

/**
 * Hook with functions for handling the current builds page
 */
export const useChangePage = () => {
	const { dispatchBuilds, storedBuilds, currentPage } = useContext(BuildsContext);
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
	const { typeFilter, versionFilter, modsFilter, challengeFilter, sortBy } = useContext(FiltersContext);
	const { lastFetchedBuild, fetchAmount } = useContext(BuildsContext);
	const { user } = useContext(AuthContext);

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
		if (typeFilter !== '') constraints.unshift(where('type', 'array-contains', typeFilter));
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
		if (type === 'user' && fetchUid !== user.uid) constraints.unshift(where('visibility', '==', 'public'));

		return query(collection(db, process.env.REACT_APP_BUILDSDB), ...constraints);
	};

	return { createFirestoreQuery };
};

// State Updaters ---------------------------------------------------------------------------------------------------//
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
export const setClearFetchedBuilds = dispatchBuilds => {
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
