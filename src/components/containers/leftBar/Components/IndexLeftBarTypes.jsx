import React from 'react';
import VerticalTypeLink from '../../../buttons/VerticalTypeLink';
import LeftBarTitle from '../LeftBarTitle';

/**
 * Displays the types filter select
 * @returns
 */
function IndexLeftBarTypes() {
	return (
		<>
			<LeftBarTitle text="Type" />
			<ul className="btn-group btn-group-vertical w-full gap-1 mb-6 2k:mb-10">
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
		</>
	);
}

export default IndexLeftBarTypes;
