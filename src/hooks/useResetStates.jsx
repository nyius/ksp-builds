import { useEffect } from 'react';
import { setEditingComment, setEditingBuild } from '../context/build/BuildActions';
import { useBuildContext } from '../context/build/BuildContext';

/**
 * Hook to reset states
 * @returns
 */
function useResetStates() {
	const { dispatchBuild } = useBuildContext();

	// Reset edidtingBuild/editingComment stats on page load
	useEffect(() => {
		setEditingBuild(dispatchBuild, false);
		setEditingComment(dispatchBuild, false);
	}, [dispatchBuild]);
}

export default useResetStates;
