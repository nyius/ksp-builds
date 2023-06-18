import React, { useContext } from 'react';
import LeftBarTitle from '../LeftBarTitle';
import useFilters from '../../../../context/filters/FiltersActions';
import FiltersContext from '../../../../context/filters/FiltersContext';

/**
 * Displays the version select dropdown on the left index bar
 * @returns
 */
function IndexLeftBarVersions() {
	const { setVersionFilter } = useFilters();
	const { filtersLoading, kspVersions } = useContext(FiltersContext);

	return (
		<>
			<LeftBarTitle text="KSP Version" />
			<select id="versionsSelect" onChange={setVersionFilter} className="select select-bordered w-full 2k:select-lg 2k:text-xl mb-6 2k:mb-12">
				<optgroup>
					<option value="any">Any</option>
					{!filtersLoading &&
						kspVersions.map((version, i) => {
							return (
								<option key={i} value={version}>
									{version} {i === 0 && '(Current)'}
								</option>
							);
						})}
				</optgroup>
			</select>
		</>
	);
}

export default IndexLeftBarVersions;
