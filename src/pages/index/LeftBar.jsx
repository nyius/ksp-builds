import React from 'react';
import VerticalLink from './VerticalLink';

function LeftBar() {
	return (
		<div className="sidebar-left bg-base-400 rounded-xl p-4">
			<p className="text-2xl text-slate-100 font-bold mb-2">Type</p>
			<ul className="menu w-full">
				<VerticalLink text="Interplanetary" url="/" />
				<VerticalLink text="Interstellar" url="/" />
				<VerticalLink text="Satellite" url="/" />
				<VerticalLink text="Space Station" url="/" />
				<VerticalLink text="Lander" url="/" />
				<VerticalLink text="Rover" url="/" />
				<VerticalLink text="SSTO" url="/" />
				<VerticalLink text="Spaceplane" url="/" />
				<VerticalLink text="Probe" url="/" />
				<VerticalLink text="Probe" url="/" />
			</ul>
		</div>
	);
}

export default LeftBar;
