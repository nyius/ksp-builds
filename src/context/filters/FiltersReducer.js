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
				typeFilters: [],
				versionFilters: [],
				searchTerm: '',
				tagsSearch: '',
				sortBy: 'newest',
			};

		default:
			return state;
	}
};

export default FiltersReducer;
