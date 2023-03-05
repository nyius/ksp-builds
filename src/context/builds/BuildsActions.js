import { useContext, useEffect } from 'react';
import { getDocs, collection, getDoc, doc, startAfter, orderBy, limit, query, where, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase.config';
import BuildsContext from './BuildsContext';
import BuildContext from '../build/BuildContext';
import AuthContext from '../auth/AuthContext';
import { toast } from 'react-toastify';
import FiltersContext from '../filters/FiltersContext';

const useBuilds = () => {
	const { dispatchBuilds, fetchedBuilds, lastFetchedBuild } = useContext(BuildsContext);
	const { deletingDeckId, loadedBuild } = useContext(BuildContext);
	const { user } = useContext(AuthContext);
	const { typeFilter, versionFilter, searchTerm, tagsSearch, sortBy } = useContext(FiltersContext);

	/**
	 * Fetches builds from the DB. Takes in an array of build ids to fetch. if no IDs specified, grabs all builds based on filters
	 * @param {*} builds
	 */
	const fetchBuilds = async buildsToFetch => {
		try {
			dispatchBuilds({ type: 'SET_FETCHED_BUILDS_LOADING', payload: true });
			const buildsRef = collection(db, 'builds');
			const builds = [];
			let q;

			if (!buildsToFetch) {
				// Create a query
				if (typeFilter !== '') {
					q = query(
						buildsRef,
						where('type', 'array-contains', typeFilter),
						where('kspVersion', '==', versionFilter),
						orderBy('timestamp', 'desc', limit(process.env.REACT_APP_BUILDS_FETCH_NUM)),
						limit(process.env.REACT_APP_BUILDS_FETCH_NUM)
					);
				} else {
					q = query(buildsRef, orderBy('timestamp', 'desc', limit(process.env.REACT_APP_BUILDS_FETCH_NUM)), limit(process.env.REACT_APP_BUILDS_FETCH_NUM));
				}

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
					},
				});
			} else {
				const batches = [];

				// because firestore only allows query 'in' by groups of 10, we have to break it up into chunks of 10
				// by using splice, we alter the original input 'buildsToFetch' arr by removing 10 at a time
				while (buildsToFetch.length) {
					const batch = buildsToFetch.splice(0, 10);
					q = query(buildsRef, where('id', 'in', batch), orderBy('timestamp', 'desc'));

					// this gets all of the docs from our query, then loops over them and returns the raw data to our array
					batches.push(getDocs(q).then(res => res.docs.map(res => res.data())));
				}

				// now we resolve all of the promises
				const builds = await Promise.all(batches);

				dispatchBuilds({
					type: 'SET_FETCHED_BUILDS',
					payload: {
						fetchedBuilds: builds.flat(),
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
	 * Fetches each of the logged in users favorites
	 * @param {*} user
	 */
	const fetchFavorites = async () => {
		try {
			dispatchBuilds({ type: 'SET_FETCHED_BUILDS_LOADING', payload: true });

			let builds = [];

			// Loop over each favorite and load it in
			let favoritePromises = await user.favorites.map(async favorite => {
				const buildsSnap = await getDoc(doc(db, 'builds', favorite));
				const build = buildsSnap.data();

				// Check if the build exists in the db (if we cant find it, it was probably deleted and dont add it to the list)
				if (build) {
					builds.push(build);
				}
			});
			await Promise.all(favoritePromises);

			dispatchBuilds({ type: 'SET_FETCHED_BUILDS', payload: { favoriteBuilds: builds, loadingBuilds: false } });
		} catch (error) {
			console.log(error);
			dispatchBuilds({ type: 'SET_FETCHED_BUILDS_LOADING', payload: false });
		}
	};

	/**
	 * @param {*}
	 */
	const fetchMoreBuilds = async () => {
		try {
			dispatchBuilds({ type: 'FETCHING_MORE_BUILDS', payload: true });
			const builds = [];

			const buildsRef = collection(db, 'builds');

			// Create a query
			const q = query(buildsRef, orderBy('timestamp', 'desc', limit(process.env.REACT_APP_BUILDS_FETCH_NUM)), startAfter(lastFetchedBuild), limit(process.env.REACT_APP_BUILDS_FETCH_NUM));

			const buildsSnap = await getDocs(q);

			buildsSnap.forEach(doc => {
				const build = doc.data();
				builds.push(build);
			});

			dispatchBuilds({
				type: 'SET_FETCHED_BUILDS',
				payload: {
					fetchedBuilds: [...fetchedBuilds, ...builds],
					loadingBuilds: false,
					lastFetchedBuild: buildsSnap.docs.length < process.env.REACT_APP_BUILDS_FETCH_NUM ? 'end' : buildsSnap.docs[buildsSnap.docs.length - 1],
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

	return { removeBuildFromFetchedBuilds, fetchBuilds, fetchFavorites, fetchMoreBuilds };
};

export default useBuilds;
