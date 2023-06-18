import React, { useContext } from 'react';
import { setFetchAmount } from '../../context/builds/BuildsActions';
import BuildsContext from '../../context/builds/BuildsContext';

/**
 * Diaplays the amount of builds to fetch
 * @returns
 */
function FetchAmount() {
	const { dispatchBuilds, gridSize } = useContext(BuildsContext);

	//---------------------------------------------------------------------------------------------------//
	return (
		<select onChange={e => setFetchAmount(dispatchBuilds, Number(e.target.value))} className="select select-bordered 2k:select-lg 2k:text-2xl 2k:font-thin max-w-xs bg-base-900 mr-6 md:mr-0">
			<optgroup>
				<option value="" hidden defaultValue={true}>
					Builds to Load
				</option>
				<option value={gridSize * 4}>{gridSize * 4}</option>
				<option value={gridSize * 6}>{gridSize * 6}</option>
				<option value={gridSize * 8}>{gridSize * 8}</option>
			</optgroup>
		</select>
	);
}

export default FetchAmount;
