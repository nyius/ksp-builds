import React, { useState } from 'react';
import { setFetchAmount } from '../../context/builds/BuildsActions';
import { useBuildsContext } from '../../context/builds/BuildsContext';
import Select, { Option } from '../selects/Select';

/**
 * Diaplays the amount of builds to fetch
 * @returns
 */
function FetchAmount() {
	const [visible, setVisible] = useState(false);
	const { dispatchBuilds, gridSize, fetchAmount } = useBuildsContext();

	//---------------------------------------------------------------------------------------------------//
	return (
		<Select selectedOption={fetchAmount} visibleState={visible} visibleSetter={setVisible} size="w-52" selectText="Show:">
			<Option displayText={gridSize * 4} id={gridSize * 4} handlerFunc={e => setFetchAmount(dispatchBuilds, Number(e.target.id))}>
				{gridSize * 4}
			</Option>
			<Option displayText={gridSize * 6} id={gridSize * 6} handlerFunc={e => setFetchAmount(dispatchBuilds, Number(e.target.id))}>
				{gridSize * 6}
			</Option>
			<Option displayText={gridSize * 8} id={gridSize * 8} handlerFunc={e => setFetchAmount(dispatchBuilds, Number(e.target.id))}>
				{gridSize * 8}
			</Option>
		</Select>
	);
}

export default FetchAmount;
