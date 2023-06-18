import React from 'react';

function BuildCardChallenge({ challenge }) {
	if (challenge) {
		return (
			<h3 className="text-slate-300 text-xl 2k:text-2xl sm:text-lg multi-line-truncate">
				<span className="text-slate-500 italic"> Challenge:</span> {challenge}
			</h3>
		);
	}
}

export default BuildCardChallenge;
