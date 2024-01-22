import { cloneDeep } from 'lodash';

export const AccoladesReducer = (state, action) => {
	switch (action.type) {
		case 'SET_ACCOLADES':
			return { ...state, ...action.payload };
		case 'SET_ACCOLADES_LOADING':
			return { ...state, loadingAccolades: action.payload };
		case 'SET_FETCHED_ACCOLADES':
			return { ...state, fetchedAccolades: action.payload };
		case 'SET_ACCOLADE_VIEWER':
			return { ...state, accoladeViewer: action.payload.accolade, accoladeViewerUserAccolades: action.payload.usersAccolades };
		case 'SET_TOTAL_ACCOLADE_COUNT':
			return { ...state, totalAccoladeCount: action.payload };
		case 'SET_TOTAL_ACCOLADE_POINTS':
			return { ...state, totalAccoladePoints: action.payload };
		case 'ADD_NEW_ACCOLADE':
			return {
				...state,
				fetchedAccolades: [...state.fetchedAccolades, action.payload],
			};
		case 'DELETE_ACCOLADE':
			return {
				...state,
				fetchedAccolades: [...state.fetchedAccolades.filter(filterAccolade => filterAccolade.id !== action.payload)],
			};
		case 'UPDATE_ACCOLADE':
			const newAccolades = cloneDeep(state.fetchedAccolades);
			for (let i = 0; i < newAccolades.length; i++) {
				if (newAccolades[i].id === action.payload.id) {
					newAccolades[i] = action.payload;
					break;
				}
			}

			return {
				...state,
				fetchedAccolades: newAccolades,
			};
		default:
			return state;
	}
};
