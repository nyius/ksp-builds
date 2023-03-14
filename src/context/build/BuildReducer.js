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

		default:
			return state;
	}
};

export default BuildReducer;
