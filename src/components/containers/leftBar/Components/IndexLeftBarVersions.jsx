import React, { useState } from 'react';
import LeftBarTitle from '../LeftBarTitle';
import useFilters from '../../../../context/filters/FiltersActions';
import { useFiltersContext } from '../../../../context/filters/FiltersContext';
import Select from '../../../selects/Select';

/**
 * Displays the version select dropdown on the left index bar
 * @returns
 */
function IndexLeftBarVersions() {
	const { setVersionFilter } = useFilters();
	const { filtersLoading, kspVersions, versionFilter } = useFiltersContext();

	const handleChangeVersion = e => {
		setVersionFilter(e);
	};

	const { SelectBox, Option } = Select(handleChangeVersion, { id: versionFilter, text: versionFilter });

	return (
		<>
			<LeftBarTitle text="KSP Version" />
			<SelectBox id="versionsSelect" size="w-full" dropdownCSS="border-1 border-solid border-slate-700">
				<Option id="any" displayText="Any" />
				{!filtersLoading &&
					kspVersions.map((version, i) => {
						return <Option id={version} key={i} displayText={`${version} ${i === 0 ? '(Current)' : ''}`} />;
					})}
			</SelectBox>
		</>
	);
}

export default IndexLeftBarVersions;
