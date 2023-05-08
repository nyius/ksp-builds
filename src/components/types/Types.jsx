import React from 'react';
import VerticalTypeLink from '../buttons/VerticalTypeLink';
import { IoIosRocket } from 'react-icons/io';

function Types() {
	return (
		<div className="dropdown md:hidden ">
			<label tabIndex={2} className="btn flex flex-row gap-2">
				<span className="text-2xl:2k:text-4xl">
					<IoIosRocket />
				</span>
				Types
			</label>
			<ul tabIndex={2} className="mt-2 p-2 shadow menu menu-compact dropdown-content bg-base-200 rounded-box w-96 gap-2 z-101 p-4 drop-shadow-lg">
				<VerticalTypeLink text="Rocket" />
				<VerticalTypeLink text="Interplanetary" />
				<VerticalTypeLink text="Interstellar" />
				<VerticalTypeLink text="Satellite" />
				<VerticalTypeLink text="Space Station" />
				<VerticalTypeLink text="Lander" />
				<VerticalTypeLink text="Rover" />
				<VerticalTypeLink text="SSTO" />
				<VerticalTypeLink text="Spaceplane" />
				<VerticalTypeLink text="Probe" />
				<VerticalTypeLink text="Historic" />
				<VerticalTypeLink text="Replica" />
				<VerticalTypeLink text="Miscellaneous" />
			</ul>
		</div>
	);
}

export default Types;
