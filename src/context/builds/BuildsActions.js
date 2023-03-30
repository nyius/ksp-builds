import { useContext, useEffect } from 'react';
import { getDocs, collection, getDoc, doc, startAfter, orderBy, limit, query, where, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase.config';
import BuildsContext from './BuildsContext';
import BuildContext from '../build/BuildContext';
import AuthContext from '../auth/AuthContext';
import { toast } from 'react-toastify';
import FiltersContext from '../filters/FiltersContext';
import { cloneDeep } from 'lodash';

const useBuilds = () => {
	const { dispatchBuilds, fetchedBuilds, lastFetchedBuild, currentPage, storedBuilds } = useContext(BuildsContext);
	const { deletingDeckId, loadedBuild } = useContext(BuildContext);
	const { user } = useContext(AuthContext);
	const { typeFilter, versionFilter, modsFilter, challengeFilter, searchTerm, tagsSearch, sortBy } = useContext(FiltersContext);

	/**
	 * Fetches builds from the DB. Takes in an array of build ids to fetch. if no IDs specified, grabs all builds based on filters
	 * @param {*} buildsToFetch
	 */
	const fetchBuilds = async (buildsToFetch, fetchUid) => {
		const buildsToFetchCopy = cloneDeep(buildsToFetch);
		try {
			dispatchBuilds({
				type: 'SET_FETCHED_BUILDS',
				payload: {
					fetchedBuilds: [],
					loadingBuilds: true,
				},
			});
			const buildsRef = collection(db, process.env.REACT_APP_BUILDSDB);
			const builds = [];
			let q;

			if (!buildsToFetchCopy) {
				// Create a query
				const constraints = [where('visibility', '==', 'public'), limit(process.env.REACT_APP_BUILDS_FETCH_NUM)];

				if (versionFilter !== 'any') constraints.unshift(where('kspVersion', '==', versionFilter));
				if (typeFilter !== '') constraints.unshift(where('type', 'array-contains', typeFilter));
				if (modsFilter == 'yes') constraints.unshift(where('modsUsed', '==', true));
				if (modsFilter == 'no') constraints.unshift(where('modsUsed', '==', false));
				if (challengeFilter !== 'any') constraints.unshift(where('forChallenge', '==', challengeFilter));
				if (sortBy == 'views') constraints.unshift(orderBy('views', 'desc'));
				if (sortBy == 'date_newest') constraints.unshift(orderBy('timestamp', 'desc'));
				if (sortBy == 'date_oldest') constraints.unshift(orderBy('timestamp', 'asc'));
				if (sortBy == 'upVotes') constraints.unshift(orderBy('upVotes', 'desc'));
				if (sortBy == 'comments') constraints.unshift(orderBy('commentCount', 'desc'));
				q = query(buildsRef, ...constraints);

				const buildsSnap = await getDocs(q);

				buildsSnap.forEach(doc => {
					builds.push(doc.data());
				});

				dispatchBuilds({
					type: 'SET_FETCHED_BUILDS',
					payload: {
						fetchedBuilds: builds,
						loadingBuilds: false,
						lastFetchedBuild: buildsSnap.docs.length < process.env.REACT_APP_BUILDS_FETCH_NUM ? 'end' : buildsSnap.docs[buildsSnap.docs.length - 1],
						storedBuilds: [builds],
					},
				});
			} else {
				const batches = [];

				// because firestore only allows query 'in' by groups of 10, we have to break it up into chunks of 10
				// by using splice, we alter the original input 'buildsToFetchCopy' arr by removing 10 at a time
				while (buildsToFetchCopy.length) {
					const batch = buildsToFetchCopy.splice(0, 10);
					const constraints = [where('id', 'in', batch)];

					// if the builds were fetching isnt the current users, only fetch builds that are listed as public
					if (fetchUid !== user.uid) constraints.unshift(where('visibility', '==', 'public'));
					if (sortBy == 'views') constraints.unshift(orderBy('views', 'desc'));
					if (sortBy == 'date_newest') constraints.unshift(orderBy('timestamp', 'desc'));
					if (sortBy == 'date_oldest') constraints.unshift(orderBy('timestamp', 'asc'));
					if (sortBy == 'upVotes') constraints.unshift(orderBy('upVotes', 'desc'));
					if (sortBy == 'comments') constraints.unshift(orderBy('commentCount', 'desc'));
					q = query(buildsRef, ...constraints);

					// this gets all of the docs from our query, then loops over them and returns the raw data to our array
					batches.push(getDocs(q).then(res => res.docs.map(res => res.data())));
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
			}
		} catch (error) {
			console.log(error);
			dispatchBuilds({ type: 'SET_FETCHED_BUILDS_LOADING', payload: false });
			throw new Error(error);
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

			const constraints = [where('visibility', '==', 'public'), limit(process.env.REACT_APP_BUILDS_FETCH_NUM), startAfter(lastFetchedBuild)];

			if (versionFilter !== 'any') constraints.unshift(where('kspVersion', '==', versionFilter));
			if (typeFilter !== '') constraints.unshift(where('type', 'array-contains', typeFilter));
			if (modsFilter == 'yes') constraints.unshift(where('modsUsed', '==', true));
			if (modsFilter == 'no') constraints.unshift(where('modsUsed', '==', false));
			if (challengeFilter !== 'any') constraints.unshift(where('forChallenge', '==', challengeFilter));
			if (sortBy == 'views') constraints.unshift(orderBy('views', 'desc'));
			if (sortBy == 'date_newest') constraints.unshift(orderBy('timestamp', 'desc'));
			if (sortBy == 'date_oldest') constraints.unshift(orderBy('timestamp', 'asc'));
			if (sortBy == 'upVotes') constraints.unshift(orderBy('upVotes', 'desc'));
			if (sortBy == 'comments') constraints.unshift(orderBy('commentCount', 'desc'));
			q = query(buildsRef, ...constraints);

			const buildsSnap = await getDocs(q);

			buildsSnap.forEach(doc => {
				const build = doc.data();
				builds.push(build);
			});

			dispatchBuilds({
				type: 'SET_FETCHED_BUILDS',
				payload: {
					fetchedBuilds: [...builds],
					loadingBuilds: false,
					lastFetchedBuild: buildsSnap.docs.length < process.env.REACT_APP_BUILDS_FETCH_NUM ? 'end' : buildsSnap.docs[buildsSnap.docs.length - 1],
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
	 * Handles removing the build fromt the fetched builds list
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
	 * Handles going back a page. Gets the page from the localstorage
	 * @param {*} page
	 */
	const goBackPage = page => {
		const builds = storedBuilds[page];

		dispatchBuilds({
			type: 'SET_FETCHED_BUILDS',
			payload: {
				fetchedBuilds: [...builds],
				currentPage: currentPage - 1,
			},
		});
	};

	/**
	 * Handles going back to page 0
	 */
	const goToStartPage = () => {
		const builds = storedBuilds[0];

		dispatchBuilds({
			type: 'SET_FETCHED_BUILDS',
			payload: {
				fetchedBuilds: [...builds],
				currentPage: 0,
			},
		});
	};

	return { removeBuildFromFetchedBuilds, fetchBuilds, fetchMoreBuilds, setBuildsLoading, setCurrentPage, clearFetchedBuilds, goBackPage, goToStartPage };
};

export default useBuilds;
