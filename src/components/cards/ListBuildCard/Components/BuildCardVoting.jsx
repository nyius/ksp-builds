import React from 'react';
import VoteArrows from '../../../buttons/VoteArrows';

/**
 * Handles displaying the voting arrows
 * @param {obj} build - the build object
 * @returns
 */
function BuildCardVoting({ build }) {
	return (
		<div className={`flex items-center justify-center h-full w-32`}>
			<VoteArrows build={build} view="stacked" />
		</div>
	);
}

export default BuildCardVoting;
