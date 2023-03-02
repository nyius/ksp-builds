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
				colorFilters: [],
				manaFilters: [],
				searchTerm: '',
				tagsSearch: '',
				typeFilter: '',
				formatFilter: 'any',
				sortBy: 'newest',
			};

		default:
			return state;
	}
};

export default FiltersReducer;
