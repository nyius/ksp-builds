import React, { createContext, useReducer, useEffect, useContext } from 'react';
import HangarReducer from './HangarReducer';

const HangarContext = createContext();

export const HangarProvider = ({ children }) => {
	const initialState = {
		loadingHangar: false,
		updatingHangarName: null,
		openedHangar: false,
		lastClickTime: 0,
		editingHangar: null,
		editingHangarName: null,
		selectedHangars: [],
		pinnedHangar: null,
		fetchedPinnedHangar: null,
		buildToAddToHangar: null,
		makingNewHangar: false,
		newHangarName: '',
		deleteHangarId: null,
		deleteHangarName: null,
		fetchedHangars: {},
		hangarView: 'grid',
		addToHangarModalOpen: false,
		lastSelectedHangarId: null,
		hangarLocation: null,
		usersHangars: null,
		collapsedHangars: false,
		currentHangarOwner: null,
		savingToHangar: false,
		hangarLimitModal: false,
	};

	useEffect(() => {
		const hangarView = localStorage.getItem('hangarView');

		if (hangarView) {
			dispatchHangars({
				type: 'SET_HANGARS',
				payload: { hangarView: hangarView },
			});
		}
	}, []);

	const [state, dispatchHangars] = useReducer(HangarReducer, initialState);

	return <HangarContext.Provider value={{ ...state, dispatchHangars }}>{children}</HangarContext.Provider>;
};

/**
 * Hangar Context
 * @returns
 */
export const useHangarContext = () => {
	const context = useContext(HangarContext);

	return context;
};

export default HangarContext;
