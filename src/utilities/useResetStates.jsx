import React, { useEffect } from 'react';
import useBuild from '../context/build/BuildActions';
import useFilters from '../context/filters/FiltersActions';

function useResetStates() {
	const { setEditingBuild, setEditingComment } = useBuild();
	const { resetFilters } = useFilters();

	// Reset edidtingBuild/editingComment stats on page load
	const resetStates = () => {
		setEditingBuild(false);
		setEditingComment(false);
		resetFilters();
	};
	return {
		resetStates,
	};
}

export default useResetStates;
