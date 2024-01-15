import React, { createContext, useContext, useEffect, useReducer } from 'react';
import BuildReducer from './BuildReducer';
import { useLocation } from 'react-router-dom';
import { clearBuildToUpload, setBuildToUploadReady } from './BuildActions';

const BuildContext = createContext();

export const BuildProvider = ({ children }) => {
	const location = useLocation();
	// Initial state
	const initialState = {
		loadingBuild: true,
		editingBuild: false,
		fetchedRawBuilds: {},
		editingComment: false,
		replyingComment: null,
		uploadingBuild: false,
		savingBuild: false,
		deletingCommentId: null,
		deletingComment: false,
		loadedBuild: null,
		comments: [],
		commentsLoading: true,
		comment: '',
		resetTextEditor: '',
		buildOfTheWeek: null,
		buildToUpload: null,
		buildToUploadReady: false,
		dragBuild: null,
	};

	useEffect(() => {
		if (!location.pathname.includes('upload')) {
			clearBuildToUpload(dispatchBuild);
			setBuildToUploadReady(dispatchBuild, false);
		}
	}, [location]);

	const [state, dispatchBuild] = useReducer(BuildReducer, initialState);

	return <BuildContext.Provider value={{ ...state, dispatchBuild }}>{children}</BuildContext.Provider>;
};

/**
 * Build Context
 * @returns
 */
export const useBuildContext = () => {
	const context = useContext(BuildContext);

	return context;
};

export default BuildContext;
