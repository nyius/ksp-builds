const FiltersReducer = (state, action) => {
	console.log(action.type);
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
				versionFilter: '1.0.0',
				searchTerm: '',
				tagsSearch: '',
				sortBy: 'date_newest',
			};

		default:
			return state;
	}
};

export default FiltersReducer;
