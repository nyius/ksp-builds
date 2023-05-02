import React from 'react';
import useBuilds from '../../context/builds/BuildsActions';

function FetchAmount() {
	const { setFetchAmount } = useBuilds();
	return (
		<select onChange={e => setFetchAmount(Number(e.target.value))} className="select select-bordered 2k:select-lg 2k:text-3xl 2k:font-thin max-w-xs bg-base-900 mr-6 md:mr-0">
			<optgroup>
				<option value="" hidden defaultValue={true}>
					Builds to Load
				</option>
				<option value="15">15</option>
				<option value="30">30</option>
				<option value="45">45</option>
			</optgroup>
		</select>
	);
}

export default FetchAmount;
