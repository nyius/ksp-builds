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
		case 'SET_STREAMS':
			return {
				...state,
				streams: action.payload,
			};
		case 'SET_ARTICLES_LOADING':
			return {
				...state,
				articlesLoading: action.payload,
			};
		case 'SET_STREAMS_LOADING':
			return {
				...state,
				streamsLoading: action.payload,
			};
		case 'SET_DELETE_PATCH_ID':
			return {
				...state,
				deletePatchNoteId: action.payload,
			};
		case 'SET_EDITING_PATCH':
			return {
				...state,
				editingPatchNotes: action.payload,
			};
		case 'SET_CURRENT_HERO_SLIDE':
			return {
				...state,
				currentHeroSlide: action.payload,
			};
		case 'SET_HERO_SLIDES_LENGTH':
			return {
				...state,
				heroSlidesLength: action.payload,
			};
		case 'nextHeroSlide':
			return {
				...state,
				currentHeroSlide: state.currentHeroSlide + 1 == state.heroSlidesLength ? 0 : state.currentHeroSlide + 1,
			};
		case 'prevHeroSlide':
			return {
				...state,
				currentHeroSlide: state.currentHeroSlide == 0 ? state.heroSlidesLength - 1 : state.currentHeroSlide - 1,
			};
		case 'setHeroSlide':
			return {
				...state,
				currentHeroSlide: action.payload,
			};
		default:
			return state;
	}
};

export default NewsReducer;
