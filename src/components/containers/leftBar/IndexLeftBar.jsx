import React from 'react';
import VerticalTypeLink from '../../buttons/VerticalTypeLink';
import VerticalVersionLink from '../../buttons/VerticalVersionLink';
import LeftBarTitle from './LeftBarTitle';
import useFilters from '../../../context/filters/FiltersActions';
import Button from '../../buttons/Button';
import { useNavigate } from 'react-router-dom';

function IndexLeftBar({ text }) {
	const { resetFilters } = useFilters();
	const navigate = useNavigate();

	const handleNavigate = () => {
		resetFilters();
		navigate('/');
	};

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
				<Button icon="reset" text="Reset" onClick={handleNavigate} color="bg-base-300" size="w-full" />
			</div>
		</>
	);
}

export default IndexLeftBar;
