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
				searchTerm: '',
				tagsSearch: '',
				sortBy: 'views',
			};
		case 'SET_KSP_VERSIONS':
			return {
				...state,
				kspVersions: action.payload,
			};
		default:
			return state;
	}
};

export default FiltersReducer;
