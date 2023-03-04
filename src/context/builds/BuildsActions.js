import { useContext, useEffect } from 'react';
import { getDocs, collection, getDoc, doc, startAfter, orderBy, limit, query, where } from 'firebase/firestore';
import { db } from '../../firebase.config';
import BuildsContext from './BuildsContext';
import BuildContext from '../build/BuildContext';
import AuthContext from '../auth/AuthContext';
import { toast } from 'react-toastify';
import FiltersContext from '../filters/FiltersContext';

const useBuilds = () => {
	const { dispatchBuilds, fetchedBuilds, lastFetchedBuild } = useContext(BuildsContext);
	const { deletingDeckId } = useContext(BuildContext);
	const { user } = useContext(AuthContext);
	const { typeFilter, versionFilter, searchTerm, tagsSearch, sortBy } = useContext(FiltersContext);

	/**
	 * Fetches X builds from the databse
	 */
	const fetchBuilds = async () => {
		try {
			dispatchBuilds({ type: 'SET_FETCHED_BUILDS_LOADING', payload: true });
			const builds = [];

			const buildsRef = collection(db, 'builds');
			let q;

			// Create a query
			if (typeFilter !== '') {
				q = query(buildsRef, where('type', 'array-contains', typeFilter), where('kspVersion', '==', versionFilter), orderBy('timestamp', 'desc', limit(process.env.buildsFetchNum)), limit(process.env.buildsFetchNum));
			} else {
				q = query(buildsRef, orderBy('timestamp', 'desc', limit(process.env.buildsFetchNum)), limit(process.env.buildsFetchNum));
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
					lastFetchedBuild: buildsSnap.docs.length < process.env.buildsFetchNum ? 'end' : buildsSnap.docs[buildsSnap.docs.length - 1],
				},
			});
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
			const q = query(buildsRef, orderBy('timestamp', 'desc', limit(process.env.buildsFetchNum)), startAfter(lastFetchedBuild), limit(process.env.buildsFetchNum));

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
					lastFetchedBuild: buildsSnap.docs.length < process.env.buildsFetchNum ? 'end' : buildsSnap.docs[buildsSnap.docs.length - 1],
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
