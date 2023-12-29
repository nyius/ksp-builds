import { useEffect } from 'react';
import { setEditingComment, setEditingBuild } from '../context/build/BuildActions';
import { useBuildContext } from '../context/build/BuildContext';
import { setOpenedHangar } from '../context/hangars/HangarActions';
import { useHangarContext } from '../context/hangars/HangarContext';

/**
 * Hook to reset states
 * @returns
 */
function useResetStates() {
	const { dispatchBuild } = useBuildContext();
	const { dispatchHangars } = useHangarContext();

	// Reset edidtingBuild/editingComment stats on page load
	useEffect(() => {
		setEditingBuild(dispatchBuild, false);
		setEditingComment(dispatchBuild, false);
		setOpenedHangar(dispatchHangars, null);
	}, [dispatchBuild]);
}

export default useResetStates;
