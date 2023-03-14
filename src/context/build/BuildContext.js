import React, { createContext, useReducer } from 'react';
import BuildsReducer from '../builds/BuildsReducer';
import BuildReducer from './BuildReducer';

const BuildContext = createContext();

export const BuildProvider = ({ children }) => {
	// Initial state
	const initialState = {
		loadingBuild: true,
		editingBuild: false,
		editingComment: false,
		replyingComment: null,
		uploadingBuild: false,
		savingBuild: false,
		deletingCommentId: '',
		deletingComment: false,
		loadedBuild: null,
		comments: [],
		commentsLoading: true,
		comment: '',
	};

	const [state, dispatchBuild] = useReducer(BuildReducer, initialState);

	return <BuildContext.Provider value={{ ...state, dispatchBuild }}>{children}</BuildContext.Provider>;
};

export default BuildContext;
