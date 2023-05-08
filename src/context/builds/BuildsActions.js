import { useContext } from 'react';
import { getDocs, collection, startAfter, orderBy, limit, query, where, getDocsFromCache } from 'firebase/firestore';
import { db } from '../../firebase.config';
import BuildsContext from './BuildsContext';
import BuildContext from '../build/BuildContext';
import AuthContext from '../auth/AuthContext';
import FiltersContext from '../filters/FiltersContext';
import { cloneDeep } from 'lodash';

const useBuilds = () => {
	const { dispatchBuilds, lastFetchedBuild, currentPage, storedBuilds, fetchAmount } = useContext(BuildsContext);
	const { deletingDeckId } = useContext(BuildContext);
	const { user } = useContext(AuthContext);
	const { typeFilter, versionFilter, modsFilter, challengeFilter, sortBy } = useContext(FiltersContext);

	/**
	 * Fetches builds from the DB. Takes in an array of build ids to fetch. if no IDs specified, grabs all builds based on filters
	 * @param {*} buildsToFetch
	 */
	const fetchBuilds = async () => {
		try {
			dispatchBuilds({
				type: 'SET_FETCHED_BUILDS',
				payload: {
					fetchedBuilds: [],
					loadingBuilds: true,
				},
			});

			await fetchLastUpdatedBuilds();

			const buildsRef = collection(db, process.env.REACT_APP_BUILDSDB);
			const builds = [];

			// Create a query
			const constraints = [where('visibility', '==', 'public'), limit(fetchAmount)];

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

			let q = query(buildsRef, ...constraints);

			const buildsSnap = await getDocsFromCache(q);

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

			// console.log(builds[0]);
			// localStorage.setItem('newestBuild', JSON.stringify(builds[0]?.lastModified));

			dispatchBuilds({
				type: 'SET_FETCHED_BUILDS',
				payload: {
					fetchedBuilds: builds,
					loadingBuilds: false,
					lastFetchedBuild: buildsSnap.docs.length < fetchAmount ? 'end' : buildsSnap.docs[buildsSnap.docs.length - 1],
					storedBuilds: [builds],
				},
			});
		} catch (error) {
			console.log(error);
			dispatchBuilds({ type: 'SET_FETCHED_BUILDS_LOADING', payload: false });
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
					await getDocs(newDocsQ); // simply getDocs so it updates our cache

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
	 * @param {*}
	 */
	const fetchMoreBuilds = async () => {
		try {
			const currentPageNum = currentPage + 1;
			// First check what page we're on, and how many pages we have saved in pagination. That way we can load the paginated builds instead of fetching from the db
			if (currentPageNum < storedBuilds.length) {
				dispatchBuilds({
					type: 'SET_FETCHED_BUILDS',
					payload: {
						fetchedBuilds: [...storedBuilds[currentPageNum]],
						currentPage: currentPageNum,
					},
				});
				return;
			}

			dispatchBuilds({ type: 'FETCHING_MORE_BUILDS', payload: true });
			const builds = [];
			let q;

			const buildsRef = collection(db, process.env.REACT_APP_BUILDSDB);

			const constraints = [where('visibility', '==', 'public'), limit(fetchAmount)];

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

			q = query(buildsRef, ...constraints, startAfter(lastFetchedBuild));

			const buildsSnap = await getDocsFromCache(q);

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

			dispatchBuilds({
				type: 'SET_FETCHED_BUILDS',
				payload: {
					fetchedBuilds: [...builds],
					loadingBuilds: false,
					lastFetchedBuild: buildsSnap.docs.length < fetchAmount ? 'end' : buildsSnap.docs[buildsSnap.docs.length - 1],
					currentPage: currentPageNum,
					storedBuilds: [...storedBuilds, builds],
				},
			});
		} catch (error) {
			console.log(error);
			dispatchBuilds({ type: 'FETCHING_MORE_BUILDS', payload: false });
			throw new Error(error);
		}
	};

	/**
	 * Handles fetching a specific users builds
	 * @param {*} buildsToFetch
	 * @param {*} fetchUid
	 */
	const fetchUsersBuilds = async (buildsToFetch, fetchUid) => {
		const buildsToFetchCopy = cloneDeep(buildsToFetch);
		try {
			dispatchBuilds({
				type: 'SET_FETCHED_BUILDS',
				payload: {
					fetchedBuilds: [],
					loadingBuilds: true,
				},
			});

			await fetchLastUpdatedBuilds();

			const buildsRef = collection(db, process.env.REACT_APP_BUILDSDB);
			let q;

			const batches = [];

			// because firestore only allows query 'in' by groups of 10, we have to break it up into chunks of 10
			// by using splice, we alter the original input 'buildsToFetchCopy' arr by removing 10 at a time
			while (buildsToFetchCopy.length) {
				const batch = buildsToFetchCopy.splice(0, 10);
				const constraints = [where('id', 'in', batch)];

				// if the builds were fetching isnt the current users, only fetch builds that are listed as public
				if (fetchUid !== user.uid) constraints.unshift(where('visibility', '==', 'public'));
				if (sortBy == 'views_most') constraints.unshift(orderBy('views', 'desc'));
				if (sortBy == 'date_newest') constraints.unshift(orderBy('timestamp', 'desc'));
				if (sortBy == 'date_oldest') constraints.unshift(orderBy('timestamp', 'asc'));
				if (sortBy == 'upVotes') constraints.unshift(orderBy('upVotes', 'desc'));
				if (sortBy == 'comments') constraints.unshift(orderBy('commentCount', 'desc'));
				q = query(buildsRef, ...constraints);

				// this gets all of the docs from our query, then loops over them and returns the raw data to our array
				batches.push(getDocsFromCache(q).then(res => res.docs.map(res => res.data())));
			}

			// now we resolve all of the promises
			const builds = await Promise.all(batches);
			const buildsFlat = builds.flat();

			dispatchBuilds({
				type: 'SET_FETCHED_BUILDS',
				payload: {
					fetchedBuilds: buildsFlat,
					loadingBuilds: false,
				},
			});
		} catch (error) {
			console.log(error);
			dispatchBuilds({ type: 'SET_FETCHED_BUILDS_LOADING', payload: false });
			throw new Error(error);
		}
	};

	/**
	 * Handles removing the build from the fetched builds list
	 * @param {*} buildId
	 */
	const removeBuildFromFetchedBuilds = () => {
		dispatchBuilds({
			type: 'DELETE_DECK',
			payload: deletingDeckId,
		});
	};

	/**
	 * Handles setting the loading state for fetching builds
	 * @param {bool}
	 */
	const setBuildsLoading = bool => {
		dispatchBuilds({
			type: 'SET_FETCHED_BUILDS',
			payload: { loadingBuilds: bool },
		});
	};

	/**
	 * Clears the fetched builds
	 */
	const clearFetchedBuilds = () => {
		dispatchBuilds({
			type: 'CLEAR_BUILDS',
			payload: null,
		});
	};

	/**
	 * Handles setting what page of builds the user is currently viewing
	 * @param {*} page
	 */
	const setCurrentPage = page => {
		dispatchBuilds({
			type: 'SET_CURRENT_PAGE',
			payload: page,
		});
	};

	/**
	 * Handles setting how many ships to fetch
	 * @param {*} amount
	 */
	const setFetchAmount = amount => {
		dispatchBuilds({
			type: 'SET_FETCH_AMOUNT',
			payload: amount,
		});
	};

	/**
	 * Handles going back a page. Gets the page from the localstorage
	 * @param {*} page
	 */
	const goBackPage = page => {
		const builds = storedBuilds[page];

		dispatchBuilds({
			type: 'SET_FETCHED_BUILDS_LOADING',
			payload: true,
		});
		dispatchBuilds({
			type: 'SET_FETCHED_BUILDS',
			payload: {
				fetchedBuilds: [...builds],
				currentPage: currentPage - 1,
				loadingBuilds: false,
			},
		});
	};

	/**
	 * Handles going back to page 0
	 */
	const goToStartPage = () => {
		const builds = storedBuilds[0];

		if (builds) {
			dispatchBuilds({
				type: 'SET_FETCHED_BUILDS',
				payload: {
					fetchedBuilds: [...builds],
					currentPage: 0,
				},
			});
		}
	};

	return { removeBuildFromFetchedBuilds, fetchBuilds, fetchLastUpdatedBuilds, fetchUsersBuilds, fetchMoreBuilds, setBuildsLoading, setFetchAmount, setCurrentPage, clearFetchedBuilds, goBackPage, goToStartPage };
};

export default useBuilds;
