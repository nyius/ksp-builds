import { cloneDeep } from 'lodash';

const FoldersReducer = (state, action) => {
	switch (action.type) {
		case 'SET_FOLDERS':
			return {
				...state,
				...action.payload,
			};
		default:
			return state;
	}
};

export default FoldersReducer;
