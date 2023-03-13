import React, { useState, useContext } from 'react';
import VerticalTypeLink from '../../buttons/VerticalTypeLink';
import LeftBarTitle from './LeftBarTitle';
import useFilters from '../../../context/filters/FiltersActions';
import { useNavigate } from 'react-router-dom';
import kspVersionOpts from '../../../utilities/kspVersions';
import Button from '../../buttons/Button';
import FiltersContext from '../../../context/filters/FiltersContext';

function IndexLeftBar({ text }) {
	const { resetFilters, setVersionFilter } = useFilters();
	const { kspVersions, filtersLoading } = useContext(FiltersContext);
	const [versions, setVersions] = useState([]);
	const navigate = useNavigate();

	const handleNavigate = () => {
		resetFilters();
		navigate('/');
	};

	//---------------------------------------------------------------------------------------------------//
	return (
		<>
			<div className="hidden md:block">
				{/* Type */}
				<LeftBarTitle text="Type" />
				<ul className="btn-group btn-group-vertical w-full gap-1 mb-6 2k:mb-10">
					<VerticalTypeLink text="Interplanetary" />
					<VerticalTypeLink text="Interstellar" />
					<VerticalTypeLink text="Satellite" />
					<VerticalTypeLink text="Space Station" />
					<VerticalTypeLink text="Lander" />
					<VerticalTypeLink text="Rover" />
					<VerticalTypeLink text="SSTO" />
					<VerticalTypeLink text="Spaceplane" />
					<VerticalTypeLink text="Probe" />
				</ul>

				{/* Version */}
				<LeftBarTitle text="KSP Version" />
				<select onChange={setVersionFilter} className="select select-bordered w-full 2k:select-lg 2k:text-2xl mb-6 2k:mb-12">
					<optgroup>
						<option value="any">Any</option>
						{!filtersLoading &&
							kspVersions.map((version, i) => {
								return (
									<option key={i} value={version}>
										{version}
									</option>
								);
							})}
					</optgroup>
				</select>
				<Button icon="reset" text="Reset" onClick={handleNavigate} color="bg-base-300" size="w-full" />
			</div>
		</>
	);
}

export default IndexLeftBar;
