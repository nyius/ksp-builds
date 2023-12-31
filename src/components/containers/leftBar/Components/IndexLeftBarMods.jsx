import React, { useState } from 'react';
import LeftBarTitle from '../LeftBarTitle';
import useFilters from '../../../../context/filters/FiltersActions';
import Select from '../../../selects/Select';
import { useFiltersContext } from '../../../../context/filters/FiltersContext';

/**
 * Displays the mods filter on the left index bar
 * @returns
 */
function IndexLeftBarMods() {
	const { setModsFilter } = useFilters();
	const { modsFilter } = useFiltersContext();

	const handleModFilter = e => {
		setModsFilter(e);
	};
	const { SelectBox, Option } = Select(handleModFilter, { id: modsFilter, text: modsFilter });

	return (
		<>
			<LeftBarTitle text="Uses Mods" />
			<SelectBox size="w-full" dropdownCSS="border-1 border-solid border-slate-700">
				<Option id="any" displayText="Any" />
				<Option id="yes" displayText="Yes" />
				<Option id="no" displayText="No" />
			</SelectBox>
		</>
	);
}

export default IndexLeftBarMods;
