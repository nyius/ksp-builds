import React from 'react';

/**
 * Displays a challenges description
 * @param {*} rawChallenge - the raw challenge
 * @param {*} parsedChallenge - the parsed challenge
 * @returns
 */
function ChallengeDescription({ rawChallenge, parsedChallenge }) {
	if (rawChallenge.article.model) {
		return (
			<>
				{parsedChallenge.map((section, i) => {
					return (
						<p key={i} className="text-xl 2k:text-3xl">
							{section}
						</p>
					);
				})}
			</>
		);
	}
}

export default ChallengeDescription;
