const NewsReducer = (state, action) => {
	switch (action.type) {
		case 'SET_NEWS':
			return {
				...state,
				articles: action.payload,
			};
		case 'SET_CHALLENGES':
			return {
				...state,
				challenges: action.payload,
			};
		case 'SET_ARTICLES_LOADING':
			return {
				...state,
				articlesLoading: action.payload,
			};
		default:
			return state;
	}
};

export default NewsReducer;
