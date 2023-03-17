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
	const { dispatchBuilds, fetchedBuilds, lastFetchedBuild, currentPage } = useContext(BuildsContext);
	const { deletingDeckId, loadedBuild } = useContext(BuildContext);
	const { user } = useContext(AuthContext);
	const { typeFilter, versionFilter, searchTerm, tagsSearch, sortBy } = useContext(FiltersContext);

	/**
	 * Fetches builds from the DB. Takes in an array of build ids to fetch. if no IDs specified, grabs all builds based on filters
	 * @param {*} buildsToFetch
	 */
	const fetchBuilds = async (buildsToFetch, fetchUid) => {
		const buildsToFetchCopy = cloneDeep(buildsToFetch);
		try {
			dispatchBuilds({ type: 'SET_FETCHED_BUILDS_LOADING', payload: true });
			const buildsRef = collection(db, process.env.REACT_APP_BUILDSDB);
			const builds = [];
			let q;

			if (!buildsToFetchCopy) {
				// Create a query
				if (typeFilter !== '') {
					const constraints = [where('type', 'array-contains', typeFilter), orderBy('views', 'desc', limit(process.env.REACT_APP_BUILDS_FETCH_NUM)), limit(process.env.REACT_APP_BUILDS_FETCH_NUM)];

					if (versionFilter !== 'any') constraints.push(where('kspVersion', '==', versionFilter));
					q = query(buildsRef, ...constraints);
				} else {
					const constraints = [where('visibility', '==', 'public'), orderBy('views', 'desc', limit(process.env.REACT_APP_BUILDS_FETCH_NUM)), limit(process.env.REACT_APP_BUILDS_FETCH_NUM)];
					q = query(buildsRef, ...constraints);
				}

				const buildsSnap = await getDocs(q);

				buildsSnap.forEach(doc => {
					builds.push(doc.data());
				});

				// Add the fetched builds to local storage
				const buildsString = JSON.stringify([builds]);
				window.localStorage.setItem('builds', buildsString);

				dispatchBuilds({
					type: 'SET_FETCHED_BUILDS',
					payload: {
						fetchedBuilds: builds,
						loadingBuilds: false,
						lastFetchedBuild: buildsSnap.docs.length < process.env.REACT_APP_BUILDS_FETCH_NUM ? 'end' : buildsSnap.docs[buildsSnap.docs.length - 1],
					},
				});
			} else {
				const batches = [];

				// because firestore only allows query 'in' by groups of 10, we have to break it up into chunks of 10
				// by using splice, we alter the original input 'buildsToFetchCopy' arr by removing 10 at a time
				while (buildsToFetchCopy.length) {
					const batch = buildsToFetchCopy.splice(0, 10);
					const constraints = [where('id', 'in', batch), orderBy('timestamp', 'desc')];

					// if the builds were fetching isnt the current users, only fetch builds that are listed as public
					if (fetchUid !== user.uid) constraints.unshift(where('visibility', '==', 'public'));
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
			const localBuilds = JSON.parse(window.localStorage.getItem('builds'));
			if (currentPageNum < localBuilds.length) {
				dispatchBuilds({
					type: 'SET_FETCHED_BUILDS',
					payload: {
						fetchedBuilds: [...localBuilds[currentPageNum]],
						currentPage: currentPageNum,
					},
				});
				return;
			}

			dispatchBuilds({ type: 'FETCHING_MORE_BUILDS', payload: true });
			const builds = [];
			let q;

			const buildsRef = collection(db, process.env.REACT_APP_BUILDSDB);

			// Create a query
			if (typeFilter !== '') {
				q = query(
					buildsRef,
					where('type', 'array-contains', typeFilter),
					where('kspVersion', '==', versionFilter),
					orderBy('timestamp', 'desc', limit(process.env.REACT_APP_BUILDS_FETCH_NUM)),
					startAfter(lastFetchedBuild),
					limit(process.env.REACT_APP_BUILDS_FETCH_NUM)
				);
			} else {
				// Create a query
				q = query(buildsRef, orderBy('timestamp', 'desc', limit(process.env.REACT_APP_BUILDS_FETCH_NUM)), startAfter(lastFetchedBuild), limit(process.env.REACT_APP_BUILDS_FETCH_NUM));
			}

			const buildsSnap = await getDocs(q);

			buildsSnap.forEach(doc => {
				const build = doc.data();
				builds.push(build);
			});

			// Add the fetched builds to local storage
			const storedBuilds = JSON.parse(window.localStorage.getItem('builds'));
			storedBuilds.push(builds);
			window.localStorage.setItem('builds', JSON.stringify(storedBuilds));

			dispatchBuilds({
				type: 'SET_FETCHED_BUILDS',
				payload: {
					fetchedBuilds: [...builds],
					loadingBuilds: false,
					lastFetchedBuild: buildsSnap.docs.length < process.env.REACT_APP_BUILDS_FETCH_NUM ? 'end' : buildsSnap.docs[buildsSnap.docs.length - 1],
					currentPage: currentPageNum,
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
		const storedBuilds = JSON.parse(window.localStorage.getItem('builds'));
		const builds = storedBuilds[page];

		dispatchBuilds({
			type: 'SET_FETCHED_BUILDS',
			payload: {
				fetchedBuilds: [...builds],
				currentPage: currentPage - 1,
			},
		});
	};

	return { removeBuildFromFetchedBuilds, fetchBuilds, fetchMoreBuilds, setBuildsLoading, setCurrentPage, clearFetchedBuilds, goBackPage };
};

export default useBuilds;
