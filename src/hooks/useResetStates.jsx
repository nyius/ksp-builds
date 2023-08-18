import { useEffect } from 'react';
import { setEditingComment, setEditingBuild } from '../context/build/BuildActions';
import { useBuildContext } from '../context/build/BuildContext';
import { setOpenedFolder } from '../context/folders/FoldersActions';
import { useFoldersContext } from '../context/folders/FoldersContext';

/**
 * Hook to reset states
 * @returns
 */
function useResetStates() {
	const { dispatchBuild } = useBuildContext();
	const { dispatchFolders } = useFoldersContext();

	// Reset edidtingBuild/editingComment stats on page load
	useEffect(() => {
		setEditingBuild(dispatchBuild, false);
		setEditingComment(dispatchBuild, false);
		setOpenedFolder(dispatchFolders, null);
	}, [dispatchBuild]);
}

export default useResetStates;
