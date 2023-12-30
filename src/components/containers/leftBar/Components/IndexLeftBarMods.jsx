import React, { useState } from 'react';
import LeftBarTitle from '../LeftBarTitle';
import useFilters from '../../../../context/filters/FiltersActions';
import Select, { Option } from '../../../selects/Select';
import { useFiltersContext } from '../../../../context/filters/FiltersContext';

/**
 * Displays the mods filter on the left index bar
 * @returns
 */
function IndexLeftBarMods() {
	const { setModsFilter } = useFilters();
	const { modsFilter } = useFiltersContext();
	const [visible, setVisible] = useState(false);

	return (
		<>
			<LeftBarTitle text="Uses Mods" />
			<Select selectedOption={modsFilter} visibleState={visible} visibleSetter={setVisible} size="w-full" dropdownCSS="border-1 border-solid border-slate-700">
				<Option id="any" displayText="Any" handlerFunc={setModsFilter} selectedOption={modsFilter} visibleSetter={setVisible} />
				<Option id="yes" displayText="Yes" handlerFunc={setModsFilter} selectedOption={modsFilter} visibleSetter={setVisible} />
				<Option id="no" displayText="No" handlerFunc={setModsFilter} selectedOption={modsFilter} visibleSetter={setVisible} />
			</Select>
		</>
	);
}

export default IndexLeftBarMods;
