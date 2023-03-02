import { getDocs, collection, getDoc, doc, startAfter, orderBy, limit, query } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { useContext } from 'react';
import BuildsContext from './BuildsContext';
import BuildContext from '../build/BuildContext';
import AuthContext from '../auth/AuthContext';
import { toast } from 'react-toastify';

const useBuilds = () => {
	const { dispatchBuilds, fetchedBuilds } = useContext(BuildsContext);
	const { deletingDeckId } = useContext(BuildContext);
	const { user } = useContext(AuthContext);

	/**
	 * Fetches X builds from the databse
	 * @param {*} fetchNum
	 */
	const fetchBuilds = async fetchNum => {
		try {
			dispatchBuilds({ type: 'SET_FETCHED_BUILDS_LOADING', payload: true });
			const builds = [];

			const buildsRef = collection(db, 'builds');
			// Create a query
			const q = query(buildsRef, orderBy('timestamp', 'desc', limit(fetchNum)), limit(fetchNum));

			const buildsSnap = await getDocs(q);

			buildsSnap.forEach(doc => {
				const build = doc.data();
				build.id = doc.id;
				builds.push(build);
			});

			dispatchBuilds({
				type: 'SET_FETCHED_BUILDS',
				payload: {
					fetchedBuilds: builds,
					loadingBuilds: false,
					lastFetchedBuild: buildsSnap.docs.length < fetchNum ? 'end' : buildsSnap.docs[buildsSnap.docs.length - 1],
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
	 * @param {*} fetchNum
	 * @param {*} lastFetchedBuild
	 */
	const fetchMoreBuilds = async (fetchNum, lastFetchedBuild) => {
		try {
			dispatchBuilds({ type: 'FETCHING_MORE_BUILDS', payload: true });
			const builds = [];

			const buildsRef = collection(db, 'builds');

			// Create a query
			const q = query(buildsRef, orderBy('dateCreated', 'desc', limit(fetchNum)), startAfter(lastFetchedBuild), limit(fetchNum));

			const buildsSnap = await getDocs(q);

			buildsSnap.forEach(doc => {
				const build = doc.data();
				builds.push(build);
			});

			dispatchBuilds({
				type: 'SET_FETCHED_DECKS',
				payload: {
					fetchedBuilds: [...fetchedBuilds, ...builds],
					loadingBuilds: false,
					lastFetchedBuild: buildsSnap.docs.length < fetchNum ? 'end' : buildsSnap.docs[buildsSnap.docs.length - 1],
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
