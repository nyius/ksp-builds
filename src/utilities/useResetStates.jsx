import { setEditingComment, setEditingBuild } from '../context/build/BuildActions';
import BuildContext from '../context/build/BuildContext';
import { useContext } from 'react';

/**
 * Hook to reset states
 * @returns
 */
function useResetStates() {
	const { dispatchBuild } = useContext(BuildContext);

	// Reset edidtingBuild/editingComment stats on page load
	const resetStates = () => {
		setEditingBuild(dispatchBuild, false);
		setEditingComment(dispatchBuild, false);
	};
	return {
		resetStates,
	};
}

export default useResetStates;
