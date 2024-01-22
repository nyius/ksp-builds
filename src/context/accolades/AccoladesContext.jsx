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
		checkedInterstellarPioneer: false,
		checkedCommsSpecialist: false,
		checkedStellarLuminary: false,
		checkedOmuamua: false,
		fetchedUsersBuilds: [],
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

	// Fetch this users builds -----------------------------------------------------------
	useEffect(() => {
		const fetchBuilds = async () => {
			try {
				if (!authLoading && user) {
					if (state.checkedChallengeMaestro) return;
					if (user.builds?.length > 0) {
						// Fetche the users builds
						const buildsToFetch = cloneDeep(user.builds);
						const batches = [];

						// because firestore only allows query 'in' by groups of 10, we have to break it up into chunks of 10
						// by using splice, we alter the original input 'buildsToFetchCopy' arr by removing 10 at a time
						while (buildsToFetch.length) {
							const batch = buildsToFetch.splice(0, 10);
							let q = query(collection(db, 'builds'), where('id', 'in', batch));
							// this gets all of the docs from our query, then loops over them and returns the raw data to our array
							batches.push(getDocs(q).then(res => res.docs.map(res => res.data())));
						}

						const fetchedBuilds = await Promise.all(batches);
						const builds = fetchedBuilds.flat();

						dispatchAccolades({
							type: 'SET_ACCOLADES',
							payload: { fetchedUsersBuilds: builds },
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

	// Check for Challenge Maestro accolade -----------------------------------------------------------
	useEffect(() => {
		if (state.fetchedUsersBuilds.length > 0 && !state.checkedChallengeMaestro) {
			let challengeCount = 0;

			state.fetchedUsersBuilds.map(build => {
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
	}, [state.fetchedUsersBuilds]);

	// Check for Stellar Lumindary accolade -----------------------------------------------------------
	useEffect(() => {
		if (state.fetchedUsersBuilds.length > 0 && !state.checkedStellarLuminary) {
			let viewCount = 0;

			state.fetchedUsersBuilds.map(build => {
				viewCount += build.views;
			});

			// Challenge Maestro ----------------------------------------------------------------
			checkAndAwardAccoladeGroup(
				dispatchAuth,
				user,
				state.fetchedAccolades,
				{
					diamond: {
						id: 'YrrDviRWSPsV5kOhQN2R',
						minPoints: 1000000,
					},
					platinum: {
						id: 'D8ymDlEAIEsrHBmQ6Yvt',
						minPoints: 100000,
					},
					gold: {
						id: 'KEYYp9fGBrr5oKlctHw1',
						minPoints: 10000,
					},
					silver: {
						id: 'yvt0PCcktrSKyrfTrsMu',
						minPoints: 1000,
					},
					bronze: {
						id: 'bqLWTQjhgxoHmVV4El0x',
						minPoints: 100,
					},
				},
				viewCount
			);

			dispatchAccolades({
				type: 'SET_ACCOLADES',
				payload: { checkedStellarLuminary: true },
			});
		}
	}, [state.fetchedUsersBuilds]);

	// Check for Interstellar Pioneer accolade -----------------------------------------------------------
	useEffect(() => {
		if (state.fetchedUsersBuilds.length > 0 && !state.checkedInterstellarPioneer) {
			let downloadCount = 0;

			state.fetchedUsersBuilds.map(build => {
				downloadCount += build.downloads;
			});

			// Interstellar Pioneer ----------------------------------------------------------------
			checkAndAwardAccoladeGroup(
				dispatchAuth,
				user,
				state.fetchedAccolades,
				{
					diamond: {
						id: 'UljELFOPPQClPNTGX5Vn',
						minPoints: 1000000,
					},
					platinum: {
						id: 'i9yjd2K1Nx9wX0NmHzaZ',
						minPoints: 100000,
					},
					gold: {
						id: 'LNi7hrijVuql5POjgTWd',
						minPoints: 10000,
					},
					silver: {
						id: 'aP5VOgE6T3QFamBymWc7',
						minPoints: 1000,
					},
					bronze: {
						id: 'GQao2IKDeCaR4nvakXxc',
						minPoints: 100,
					},
				},
				downloadCount
			);

			dispatchAccolades({
				type: 'SET_ACCOLADES',
				payload: { checkedInterstellarPioneer: true },
			});
		}
	}, [state.fetchedUsersBuilds]);

	// Check for Comms Specialist accolade -----------------------------------------------------------
	useEffect(() => {
		if (!authLoading && user && !state.checkedCommsSpecialist) {
			checkAndAwardAccoladeGroup(
				dispatchAuth,
				user,
				state.fetchedAccolades,
				{
					diamond: {
						id: 'SlDf64uN2xGWPeUVLDZy',
						minPoints: 500,
					},
					platinum: {
						id: '4vgkWwaPaeF4lCfgVYOf',
						minPoints: 100,
					},
					gold: {
						id: 'Vq1bSHi2wqLRZWMghjJP',
						minPoints: 50,
					},
					silver: {
						id: 'vV0w05JmlNuvrgAcjglq',
						minPoints: 20,
					},
					bronze: {
						id: 'eCKqKKulTnYnFM3Vzu7q',
						minPoints: 10,
					},
				},
				user.commentCount
			);

			dispatchAccolades({
				type: 'SET_ACCOLADES',
				payload: { checkedCommsSpecialist: true },
			});
		}
	}, [user, authLoading]);

	// Check for Omuamua accolade -----------------------------------------------------------
	useEffect(() => {
		if (!authLoading && user && !state.checkedOmuamua) {
			checkAndAwardAccoladeGroup(
				dispatchAuth,
				user,
				state.fetchedAccolades,
				{
					diamond: {
						id: 'OKiOy3nv4LSpIfwXHHDv',
						minPoints: 365,
					},
					platinum: {
						id: 'FIuQ9COHD6DGMqoi7E8g',
						minPoints: 100,
					},
					gold: {
						id: 'OQBrueUFbym5bCiCOjOE',
						minPoints: 50,
					},
					silver: {
						id: 'EzBcLhKOrTpMFMcU3zX1',
						minPoints: 20,
					},
					bronze: {
						id: 'NryPxVLYYTVrZBiIwk4v',
						minPoints: 10,
					},
				},
				user.dailyVisits
			);

			dispatchAccolades({
				type: 'SET_ACCOLADES',
				payload: { checkedOmuamua: true },
			});
		}
	}, [user, authLoading]);

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
