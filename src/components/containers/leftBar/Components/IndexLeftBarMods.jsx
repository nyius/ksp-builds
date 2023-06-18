import React from 'react';
import LeftBarTitle from '../LeftBarTitle';
import useFilters from '../../../../context/filters/FiltersActions';

/**
 * Displays the mods filter on the left index bar
 * @returns
 */
function IndexLeftBarMods() {
	const { setModsFilter } = useFilters();
	return (
		<>
			<LeftBarTitle text="Uses Mods" />
			<select id="modsSelect" onChange={setModsFilter} className="select select-bordered w-full 2k:select-lg 2k:text-xl mb-6 2k:mb-12">
				<optgroup>
					<option value="any">Any</option>
					<option value="yes">Yes</option>
					<option value="no">No</option>
				</optgroup>
			</select>
		</>
	);
}

export default IndexLeftBarMods;
