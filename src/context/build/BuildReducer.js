const BuildReducer = (state, action) => {
	switch (action.type) {
		case 'SET_BUILD':
			return {
				...state,
				...action.payload,
			};
		case 'UPDATE_BUILD':
			return {
				...state,
				loadedBuild: {
					...state.loadedBuild,
					...action.payload,
				},
			};
		case 'LOADING_BUILD':
			return {
				...state,
				loadingBuild: action.payload,
			};
		case 'EDITING_BUILD':
			return {
				...state,
				editingBuild: action.payload,
			};
		case 'EDITING_COMMENT':
			return {
				...state,
				editingComment: action.payload,
			};
		case 'REPLYING_COMMENT':
			return {
				...state,
				replyingComment: action.payload,
			};
		case 'UPLOADING_BUILD':
			return {
				...state,
				uploadingBuild: action.payload,
			};
		case 'SAVING_BUILD':
			return {
				...state,
				savingBuild: action.payload,
			};
		case 'DELETING_BUILD':
			return {
				...state,
				deletingBuild: action.payload,
			};
		case 'RESET_TEXT_EDITOR':
			return {
				...state,
				resetTextEditor: action.payload,
			};
		case 'SET_BUILD_OF_THE_WEEK':
			return {
				...state,
				buildOfTheWeek: action.payload,
			};
		case 'SET_UPLOAD_CHALLENGE':
			return {
				...state,
				buildToUpload: {
					...state.buildToUpload,
					...action.payload,
				},
			};
		case 'SET_LOADED_RAW_BUILD':
			return {
				...state,
				fetchedRawBuilds: {
					...state.fetchedRawBuilds,
					[action.payload.id]: action.payload.rawBuild,
				},
			};
		default:
			return state;
	}
};

export default BuildReducer;
