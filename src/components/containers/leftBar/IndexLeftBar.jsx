import React from 'react';
import VerticalTypeLink from '../../../pages/index/VerticalTypeLink';
import VerticalVersionLink from '../../../pages/index/VerticalVersionLink';
import LeftBarTitle from './LeftBarTitle';
import useFilters from '../../../context/filters/FiltersActions';
import Button from '../../buttons/Button';

function IndexLeftBar({ text }) {
	const { resetFilters } = useFilters();

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
				<ul className="menu w-full mb-6">
					<VerticalVersionLink text="1.0.0" />
				</ul>
				<Button icon="reset" text="Reset" onClick={resetFilters} color="bg-base-600" size="w-full" />
			</div>
		</>
	);
}

export default IndexLeftBar;
