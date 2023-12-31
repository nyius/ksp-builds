import React from 'react';
import { setFetchAmount } from '../../context/builds/BuildsActions';
import { useBuildsContext } from '../../context/builds/BuildsContext';
import Select from '../selects/Select';

/**
 * Diaplays the amount of builds to fetch
 * @returns
 */
function FetchAmount() {
	const { dispatchBuilds, gridSize, fetchAmount } = useBuildsContext();

	/**
	 * Handles user changing fetch amount
	 * @param {*} e
	 */
	const handleChangeFetchAmount = e => {
		setFetchAmount(dispatchBuilds, Number(e.target.id));
	};

	const { SelectBox, Option } = Select(handleChangeFetchAmount, { id: fetchAmount, text: fetchAmount });

	//---------------------------------------------------------------------------------------------------//
	return (
		<SelectBox size="w-52" selectText="Show:">
			<Option displayText={gridSize * 4} id={gridSize * 4} />
			<Option displayText={gridSize * 6} id={gridSize * 6} />
			<Option displayText={gridSize * 8} id={gridSize * 8} />
		</SelectBox>
	);
}

export default FetchAmount;
