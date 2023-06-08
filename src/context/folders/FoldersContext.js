import React, { createContext, useReducer, useEffect } from 'react';
import FoldersReducer from './FoldersReducer';

const FoldersContext = createContext();

export const FoldersProvider = ({ children }) => {
	const initialState = {
		loadingFolder: false,
		updatingFolderName: null,
		openedFolder: false,
		lastClickTime: 0,
		editingFolder: null,
		editingFolderName: null,
		selectedFolders: [],
		buildToAddToFolder: null,
		makingNewFolder: false,
		newFolderName: '',
		deleteFolderId: null,
		deleteFolderName: null,
		fetchedFolders: {},
		folderView: 'grid',
		addToFolderModalOpen: false,
		lastSelectedFolderId: null,
	};

	useEffect(() => {
		const folderView = localStorage.getItem('folderView');
		dispatchFolders({
			type: 'SET_FOLDERS',
			payload: { folderView: folderView },
		});
	}, []);

	const [state, dispatchFolders] = useReducer(FoldersReducer, initialState);

	return <FoldersContext.Provider value={{ ...state, dispatchFolders }}>{children}</FoldersContext.Provider>;
};

export default FoldersContext;
