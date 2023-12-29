const HangarReducer = (state, action) => {
	switch (action.type) {
		case 'SET_HANGARS':
			return {
				...state,
				...action.payload,
			};
		case 'setPinnedHangar':
			return {
				...state,
				pinnedHangar: action.payload,
			};
		default:
			return state;
	}
};

export default HangarReducer;
