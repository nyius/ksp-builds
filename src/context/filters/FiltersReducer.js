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
				sortBy: 'date_newest',
			};

		default:
			return state;
	}
};

export default FiltersReducer;
