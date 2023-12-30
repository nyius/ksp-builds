import React, { useState } from 'react';
import LeftBarTitle from '../LeftBarTitle';
import useFilters from '../../../../context/filters/FiltersActions';
import { useFiltersContext } from '../../../../context/filters/FiltersContext';
import Select, { Option } from '../../../selects/Select';

/**
 * Displays the version select dropdown on the left index bar
 * @returns
 */
function IndexLeftBarVersions() {
	const { setVersionFilter } = useFilters();
	const { filtersLoading, kspVersions, versionFilter } = useFiltersContext();
	const [visible, setVisible] = useState(false);

	return (
		<>
			<LeftBarTitle text="KSP Version" />
			<Select id="versionsSelect" selectedOption={versionFilter} visibleState={visible} visibleSetter={setVisible} size="w-full" dropdownCSS="border-1 border-solid border-slate-700">
				<Option selectedOption={versionFilter} id="any" displayText="Any" handlerFunc={setVersionFilter} />
				{!filtersLoading &&
					kspVersions.map((version, i) => {
						return <Option selectedOption={versionFilter} id={version} key={i} visibleSetter={setVisible} displayText={`${version} ${i === 0 ? '(Current)' : ''}`} handlerFunc={setVersionFilter} />;
					})}
			</Select>
		</>
	);
}

export default IndexLeftBarVersions;
