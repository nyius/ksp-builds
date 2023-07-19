import React from 'react';
import Parser from 'html-react-parser';

/**
 * Displays a challenges description
 * @param {*} challenge - the raw challenge
 * @returns
 */
function ChallengeDescription({ challenge }) {
	return <div className="challengeDesc">{Parser(challenge.content)}</div>;
}

export default ChallengeDescription;
