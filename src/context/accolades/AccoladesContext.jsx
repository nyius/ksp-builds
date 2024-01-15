import React, { useEffect, useState, useReducer, createContext, useContext } from 'react';
import { AccoladesReducer } from './AccoladesReducer';
import errorReport from '../../utilities/errorReport';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { useAuthContext } from '../auth/AuthContext';

const AccoladesContext = createContext();

export const AccoladesProvider = ({ children }) => {
	const { user, authLoading } = useAuthContext();

	const initialState = {
		loadingAccolades: true,
		fetchedAccolades: [],
		accoladeViewer: null,
		totalAccoladeCount: 0,
		totalAccoladePoints: 0,
	};

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
