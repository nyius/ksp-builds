import React, { useEffect, useReducer, createContext, useContext } from 'react';
import { AccoladesReducer } from './AccoladesReducer';
import errorReport from '../../utilities/errorReport';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { useAuthContext } from '../auth/AuthContext';
import { cloneDeep } from 'lodash';
import { setLocalStoredBuild } from '../build/BuildUtils';
import { checkAndAwardAccoladeGroup, checkIfUserHasAccolade } from './AccoladesUtils';
import { giveAccoladeAndNotify } from '../../hooks/useGiveAccolade';

const AccoladesContext = createContext();

export const AccoladesProvider = ({ children }) => {
	const { user, authLoading, dispatchAuth } = useAuthContext();

	const initialState = {
		loadingAccolades: true,
		fetchedAccolades: [],
		accoladeViewer: null,
		totalAccoladeCount: 0,
		totalAccoladePoints: 0,
		checkedChallengeMaestro: false,
	};

	// Get accolades
	useEffect(() => {
		const getAccoladesContext = async () => {
			try {
				const accolades = await getDocs(collection(db, 'accolades'));
				const allAccolades = [];
				accolades.forEach(doc => {
					const accolade = doc.data();
					accolade.id = doc.id;

					allAccolades.push(accolade);
				});

				// Sort the accolades into the proper order
				allAccolades.sort((a, b) => {
					const nameA = a.name.toLowerCase();
					const nameB = b.name.toLowerCase();

					if (nameA < nameB) {
						return -1;
					}
					if (nameA > nameB) {
						return 1;
					}
					return 0;
				});

				let accoladeBuffer = Array(5).fill(undefined);
				let sortedAccoladesArr = [];
				let totalPoints = 0;
				allAccolades.map(accolade => {
					totalPoints += Number(accolade.points);
					if (accolade.order) {
						// This sorts any accolades in a group (like bronze, silver, gold) so that they're all in the right order
						accoladeBuffer[Number(accolade.order) - 1] = accolade;

						const bufferIsFull = accoladeBuffer.every(item => item !== undefined);

						if (bufferIsFull) {
							sortedAccoladesArr.push(...accoladeBuffer);

							accoladeBuffer = Array(5).fill(undefined);
						}
					} else {
						sortedAccoladesArr.push(accolade);
					}
				});

				dispatchAccolades({
					type: 'SET_FETCHED_ACCOLADES',
					payload: sortedAccoladesArr,
				});

				dispatchAccolades({
					type: 'SET_ACCOLADES_LOADING',
					payload: false,
				});
				dispatchAccolades({
					type: 'SET_TOTAL_ACCOLADE_COUNT',
					payload: sortedAccoladesArr.length,
				});
				dispatchAccolades({
					type: 'SET_TOTAL_ACCOLADE_POINTS',
					payload: totalPoints,
				});
			} catch (error) {
				errorReport(error.message, true, 'getAccoladesContext');
				dispatchAccolades({
					type: 'SET_ACCOLADES_LOADING',
					payload: false,
				});
			}
		};

		getAccoladesContext();
	}, [user, authLoading]);

	// Check for Challenge Maestro accolade
	useEffect(() => {
		const fetchBuilds = async () => {
			try {
				if (!authLoading && user) {
					if (state.checkedChallengeMaestro) return;
					if (user.builds?.length > 0) {
						let challengeCount = 0;
						// Fetche the users builds
						const buildsToFetch = cloneDeep(user.builds);
						const batches = [];

						// because firestore only allows query 'in' by groups of 10, we have to break it up into chunks of 10
						// by using splice, we alter the original input 'buildsToFetchCopy' arr by removing 10 at a time
						while (buildsToFetch.length) {
							const batch = buildsToFetch.splice(0, 10);
							let q = query(collection(db, 'testBuilds'), where('id', 'in', batch));
							// this gets all of the docs from our query, then loops over them and returns the raw data to our array
							batches.push(getDocs(q).then(res => res.docs.map(res => res.data())));
						}

						const fetchedBuilds = await Promise.all(batches);
						const builds = fetchedBuilds.flat();

						builds.map(build => {
							setLocalStoredBuild(build);
							if (build.forChallenge) challengeCount++;
						});

						// Challenge Maestro ----------------------------------------------------------------
						checkAndAwardAccoladeGroup(
							dispatchAuth,
							user,
							state.fetchedAccolades,
							{
								diamond: {
									id: 'hkmi5u9Me12NeBh7ZjZr',
									minPoints: 100,
								},
								platinum: {
									id: '5DMFGdgBgM2HRo1deR1o',
									minPoints: 50,
								},
								gold: {
									id: 'Z6FKY0D8KHhxz3i5o0iG',
									minPoints: 20,
								},
								silver: {
									id: 'I9R402v2sBDfqIAleG11',
									minPoints: 10,
								},
								bronze: {
									id: 'f7mDVMAa2aGNE5MYrU6x',
									minPoints: 1,
								},
							},
							challengeCount
						);

						dispatchAccolades({
							type: 'SET_ACCOLADES',
							payload: { checkedChallengeMaestro: true },
						});
					}
				}
			} catch (error) {
				errorReport(error, true, 'fetchBuilds - accoaldes Context');
			}
		};

		fetchBuilds();
	}, [authLoading]);

	const [state, dispatchAccolades] = useReducer(AccoladesReducer, initialState);

	return <AccoladesContext.Provider value={{ ...state, dispatchAccolades }}>{children}</AccoladesContext.Provider>;
};

/**
 * Accolades Context
 * @returns
 */
export const useAccoladesContext = () => {
	const context = useContext(AccoladesContext);

	return context;
};

export default AccoladesContext;
