import React, { useEffect } from 'react';
import useBuild from '../context/build/BuildActions';

function useResetStates() {
	const { setEditingBuild, setEditingComment } = useBuild();

	// Reset edidtingBuild/editingComment stats on page load
	const resetStates = () => {
		setEditingBuild(false);
		setEditingComment(false);
	};
	return {
		resetStates,
	};
}

export default useResetStates;
