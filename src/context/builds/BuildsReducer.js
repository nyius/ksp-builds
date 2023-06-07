const BuildsReducer = (state, action) => {
	switch (action.type) {
		case 'SET_FETCHED_BUILDS':
			return {
				...state,
				...action.payload,
			};
		case 'SET_ALL_FETCHED_BUILDS':
			return {
				...state,
				allFetchedBuilds: {
					...state.allFetchedBuilds,
					[action.payload.id]: action.payload,
				},
			};
		case 'SET_FETCHED_BUILDS_LOADING':
			return {
				...state,
				loadingBuilds: action.payload,
			};
		case 'SET_BUILD_OF_THE_WEEK':
			return {
				...state,
				buildOfTheWeek: action.payload,
				loadingBuildOfTheWeek: false,
			};
		case 'SET_LOADING_BUILD_OF_THE_WEEK':
			return {
				...state,
				loadingBuildOfTheWeek: action.payload,
			};
		case 'FETCHING_MORE_BUILDS':
			return {
				...state,
				fetchingMoreBuilds: action.payload,
				loadingBuilds: true,
			};
		case `SET_FAVORITES_BUILDS`:
			return {
				...state,
				favoritesBuilds: action.payload,
				loadingBuilds: false,
			};
		case 'DELETE_BUILD':
			return {
				...state,
				fetchedBuilds: [
					...state.fetchedBuilds.filter(build => {
						return build.id !== action.payload;
					}),
				],
			};
		case 'ADD_BUILD':
			return {
				...state,
				fetchedBuilds: [action.payload, ...state.fetchedBuilds],
			};
		case 'CLEAR_BUILDS':
			return {
				...state,
				fetchedBuilds: [],
			};
		case `SET_USERS_OWN_BUILDS`:
			return {
				...state,
				usersOwnBuilds: action.payload,
				loadingBuilds: false,
			};
		case 'SET_CURRENT_PAGE':
			return {
				...state,
				currentPage: action.payload,
			};
		case 'SET_STORED_BUILDS':
			return {
				...state,
				storedBuilds: [...state.storedBuilds, action.payload],
			};
		case 'SET_FETCH_AMOUNT':
			return {
				...state,
				fetchAmount: action.payload,
			};
		default:
			return state;
	}
};

export default BuildsReducer;
