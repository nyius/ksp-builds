const FiltersReducer = (state, action) => {
	switch (action.type) {
		case 'SET_FILTERS':
			return {
				...state,
				[action.payload.filter]: action.payload.value,
			};
		case 'RESET_FILTERS':
			return {
				...state,
				typeFilter: '',
				versionFilter: 'any',
				modsFilter: 'any',
				challengeFilter: 'any',
			};
		case 'SET_KSP_VERSIONS':
			return {
				...state,
				kspVersions: action.payload,
			};
		case 'SET_KSP_CHALLENGES':
			return {
				...state,
				kspChallenges: action.payload,
			};
		default:
			return state;
	}
};

export default FiltersReducer;
