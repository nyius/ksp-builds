import React from 'react';
import VerticalTypeLink from './VerticalTypeLink';
import VerticalVersionLink from './VerticalVersionLink';

function LeftBar() {
	return (
		<div className="sidebar-left bg-base-400 rounded-xl p-4">
			<p className="text-2xl text-slate-100 font-bold mb-2 text-center">Type</p>
			<ul className="btn-group btn-group-vertical w-full gap-1">
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
			<p className="text-2xl text-slate-100 font-bold mb-2 mt-6 text-center">Version</p>
			<ul className="menu w-full">
				<VerticalVersionLink text="1.0.0" />
			</ul>
		</div>
	);
}

export default LeftBar;
