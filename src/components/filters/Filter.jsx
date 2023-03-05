import React from 'react';
import VerticalTypeLink from '../../pages/index/VerticalTypeLink';

function Filter() {
	return (
		<div className="dropdown lg:hidden ">
			<label tabIndex={2} class="btn bg-base-900">
				Filters
			</label>
			<ul tabIndex={2} className="mt-2 p-2 shadow menu menu-compact dropdown-content bg-base-200 rounded-box w-96 gap-2 z-101 p-4 drop-shadow-lg">
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
		</div>
	);
}

export default Filter;
